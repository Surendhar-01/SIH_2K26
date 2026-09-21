import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const envAdminUser = this.configService.get<string>('ADMIN_USERNAME');
    if (
      envAdminUser &&
      payload.sub === 'admin-override-id-sih-2026' &&
      payload.email?.toLowerCase() === envAdminUser.toLowerCase()
    ) {
      return {
        userId: payload.sub,
        fullName: 'ThermoShelter Administrator',
        email: envAdminUser,
        role: 'admin',
      };
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }
    return {
      userId: String(user._id),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
}
