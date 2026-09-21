"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    loginAttempts = new Map();
    loginWindowMs = 15 * 60 * 1000;
    maxLoginAttempts = 5;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async onModuleInit() {
        await this.ensureAdminExists();
    }
    async ensureAdminExists() {
        const envAdminUser = this.configService.get('ADMIN_USERNAME');
        const envAdminPass = this.configService.get('ADMIN_PASSWORD');
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
            console.log(`🔌 Dynamically created admin user from .env in database: ${email}`);
        }
        else {
            const isMatch = await bcrypt.compare(envAdminPass, existing.passwordHash);
            if (!isMatch) {
                existing.passwordHash = passwordHash;
                await existing.save();
                console.log(`🔌 Updated admin user password hash in database to match current .env configuration`);
            }
        }
    }
    async register(registerDto) {
        const email = registerDto.email.toLowerCase().trim();
        const existing = await this.usersService.findByEmail(email);
        if (existing) {
            throw new common_1.ConflictException('User already exists');
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
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('User already exists');
            }
            throw error;
        }
    }
    async login(loginDto, expectedRole) {
        const email = loginDto.email.toLowerCase();
        this.assertLoginAllowed(email);
        const envAdminUser = this.configService.get('ADMIN_USERNAME');
        const envAdminPass = this.configService.get('ADMIN_PASSWORD');
        if (envAdminUser &&
            envAdminPass &&
            email === envAdminUser.toLowerCase() &&
            loginDto.password === envAdminPass) {
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
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            this.recordFailedLogin(email);
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        this.assertExpectedRole(user.role, expectedRole);
        this.loginAttempts.delete(email);
        return this.issueTokens(this.toSafeUser(user));
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token missing');
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
            throw new common_1.UnauthorizedException('Refresh token invalid');
        }
        const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Refresh token invalid');
        }
        return this.issueTokens(this.toSafeUser(user));
    }
    async logout(userId) {
        if (userId) {
            await this.usersService.clearRefreshTokenHash(userId);
        }
        return { message: 'Logged out' };
    }
    getMe(user) {
        return { user };
    }
    async issueTokens(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: (this.configService.get('JWT_ACCESS_EXPIRES_IN') ||
                '15m'),
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: (this.configService.get('JWT_REFRESH_EXPIRES_IN') ||
                '7d'),
        });
        if (user.id !== 'admin-override-id-sih-2026') {
            const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
            await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);
        }
        return { accessToken, refreshToken, user };
    }
    async verifyRefreshToken(refreshToken) {
        try {
            return await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token invalid');
        }
    }
    toSafeUser(user) {
        return {
            id: String(user._id),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };
    }
    assertLoginAllowed(email) {
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
            throw new common_1.HttpException('Too many login attempts. Please try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    recordFailedLogin(email) {
        const now = Date.now();
        const attempt = this.loginAttempts.get(email);
        if (!attempt || now - attempt.firstAttemptAt > this.loginWindowMs) {
            this.loginAttempts.set(email, { count: 1, firstAttemptAt: now });
            return;
        }
        attempt.count += 1;
        this.loginAttempts.set(email, attempt);
    }
    isEnvAdminPayload(userId, email) {
        const envAdminUser = this.configService.get('ADMIN_USERNAME');
        return Boolean(envAdminUser &&
            userId === 'admin-override-id-sih-2026' &&
            email.toLowerCase() === envAdminUser.toLowerCase());
    }
    isDuplicateKeyError(error) {
        return (typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 11000);
    }
    assertExpectedRole(userRole, expectedRole) {
        if (expectedRole && userRole !== expectedRole) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map