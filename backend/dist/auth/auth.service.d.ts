import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
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
export declare class AuthService implements OnModuleInit {
    private usersService;
    private jwtService;
    private configService;
    private readonly loginAttempts;
    private readonly loginWindowMs;
    private readonly maxLoginAttempts;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    ensureAdminExists(): Promise<void>;
    register(registerDto: RegisterDto): Promise<SafeUser>;
    login(loginDto: LoginDto, expectedRole?: 'admin' | 'engineer'): Promise<TokenPair>;
    refresh(refreshToken?: string): Promise<TokenPair>;
    logout(userId?: string): Promise<{
        message: string;
    }>;
    getMe(user: SafeUser): {
        user: SafeUser;
    };
    private issueTokens;
    private verifyRefreshToken;
    private toSafeUser;
    private assertLoginAllowed;
    private recordFailedLogin;
    private isEnvAdminPayload;
    private isDuplicateKeyError;
    private assertExpectedRole;
}
export {};
