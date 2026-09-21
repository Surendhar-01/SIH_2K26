import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
type SafeUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
};

type LoginAttempt = {
  count: number;
  firstAttemptAt: number;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly loginAttempts = new Map<string, LoginAttempt>();
  private readonly loginWindowMs = 15 * 60 * 1000;
  private readonly maxLoginAttempts = 5;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureAdminExists();
  }

  async ensureAdminExists() {
    const envAdminUser = this.configService.get<string>('ADMIN_USERNAME');
    const envAdminPass = this.configService.get<string>('ADMIN_PASSWORD');
    if (!envAdminUser || !envAdminPass) {
      return;
    }

    const email = envAdminUser.toLowerCase();
    const existing = await this.usersService.findByEmail(email);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(envAdminPass, salt);

    if (!existing) {
      await this.usersService.create({
        fullName: 'ThermoShelter Administrator',
        email,
        passwordHash,
        role: 'admin',
      });
      console.log(
        `🔌 Dynamically created admin user from .env in database: ${email}`,
      );
    } else {
      const isMatch = await bcrypt.compare(envAdminPass, existing.passwordHash);
      if (!isMatch) {
        existing.passwordHash = passwordHash;
        await existing.save();
        console.log(
          `🔌 Updated admin user password hash in database to match current .env configuration`,
        );
      }
    }
  }

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase().trim();
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    try {
      const user = await this.usersService.create({
        fullName: registerDto.fullName.trim(),
        email,
        passwordHash,
        role: 'engineer',
      });

      return this.toSafeUser(user);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('User already exists');
      }

      throw error;
    }
  }

  async login(
    loginDto: LoginDto,
    expectedRole?: 'admin' | 'engineer',
  ): Promise<TokenPair> {
    const email = loginDto.email.toLowerCase();
    this.assertLoginAllowed(email);

    // Dynamic Environment Admin Override
    const envAdminUser = this.configService.get<string>('ADMIN_USERNAME');
    const envAdminPass = this.configService.get<string>('ADMIN_PASSWORD');

    if (
      envAdminUser &&
      envAdminPass &&
      email === envAdminUser.toLowerCase() &&
      loginDto.password === envAdminPass
    ) {
      this.assertExpectedRole('admin', expectedRole);
      this.loginAttempts.delete(email);
      const dbAdmin = await this.usersService.findByEmail(email);
      if (dbAdmin) {
        return this.issueTokens(this.toSafeUser(dbAdmin));
      }
      return this.issueTokens({
        id: 'admin-override-id-sih-2026',
        fullName: 'ThermoShelter Administrator',
        email: envAdminUser,
        role: 'admin',
      });
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.recordFailedLogin(email);
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      this.recordFailedLogin(email);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.assertExpectedRole(user.role, expectedRole);
    this.loginAttempts.delete(email);
    return this.issueTokens(this.toSafeUser(user));
  }

  async refresh(refreshToken?: string): Promise<TokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const payload = await this.verifyRefreshToken(refreshToken);

    if (this.isEnvAdminPayload(payload.sub, payload.email)) {
      return this.issueTokens({
        id: payload.sub,
        fullName: 'ThermoShelter Administrator',
        email: payload.email,
        role: 'admin',
      });
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    return this.issueTokens(this.toSafeUser(user));
  }

  async logout(userId?: string): Promise<{ message: string }> {
    if (userId) {
      await this.usersService.clearRefreshTokenHash(userId);
    }

    return { message: 'Logged out' };
  }

  getMe(user: SafeUser): { user: SafeUser } {
    return { user };
  }

  private async issueTokens(user: SafeUser): Promise<TokenPair> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
        '15m') as never,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
        '7d') as never,
    });

    // Skip DB storage for the env-admin override (not a real Mongoose ObjectId)
    if (user.id !== 'admin-override-id-sih-2026') {
      const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
      await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);
    }

    return { accessToken, refreshToken, user };
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<{ sub: string; email: string; role: string }> {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalid');
    }
  }

  private toSafeUser(user: {
    _id: unknown;
    fullName: string;
    email: string;
    role: string;
  }): SafeUser {
    return {
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }

  private assertLoginAllowed(email: string): void {
    const attempt = this.loginAttempts.get(email);
    if (!attempt) {
      return;
    }

    const isExpired = Date.now() - attempt.firstAttemptAt > this.loginWindowMs;
    if (isExpired) {
      this.loginAttempts.delete(email);
      return;
    }

    if (attempt.count >= this.maxLoginAttempts) {
      throw new HttpException(
        'Too many login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private recordFailedLogin(email: string): void {
    const now = Date.now();
    const attempt = this.loginAttempts.get(email);

    if (!attempt || now - attempt.firstAttemptAt > this.loginWindowMs) {
      this.loginAttempts.set(email, { count: 1, firstAttemptAt: now });
      return;
    }

    attempt.count += 1;
    this.loginAttempts.set(email, attempt);
  }

  private isEnvAdminPayload(userId: string, email: string): boolean {
    const envAdminUser = this.configService.get<string>('ADMIN_USERNAME');
    return Boolean(
      envAdminUser &&
      userId === 'admin-override-id-sih-2026' &&
      email.toLowerCase() === envAdminUser.toLowerCase(),
    );
  }

  private isDuplicateKeyError(error: unknown): error is { code: number } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    );
  }

  private assertExpectedRole(userRole: string, expectedRole?: string): void {
    if (expectedRole && userRole !== expectedRole) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
