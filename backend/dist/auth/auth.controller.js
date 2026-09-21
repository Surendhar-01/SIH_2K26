"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("./public.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto, expectedRole, response) {
        const session = await this.authService.login(loginDto, expectedRole);
        this.setRefreshCookie(response, session.refreshToken, loginDto.rememberMe);
        return {
            accessToken: session.accessToken,
            user: session.user,
        };
    }
    async refresh(request, response) {
        const session = await this.authService.refresh(this.getCookie(request, 'refreshToken'));
        this.setRefreshCookie(response, session.refreshToken, true);
        return {
            accessToken: session.accessToken,
            user: session.user,
        };
    }
    me(request) {
        return this.authService.getMe({
            id: request.user?.userId || '',
            fullName: request.user?.fullName || '',
            email: request.user?.email || '',
            role: request.user?.role || '',
        });
    }
    async logout(request, response) {
        response.clearCookie('refreshToken', { path: '/api/auth' });
        return this.authService.logout(request.user?.userId);
    }
    setRefreshCookie(response, refreshToken, rememberMe) {
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/api/auth',
            ...(rememberMe ? { maxAge: 7 * 24 * 60 * 60 * 1000 } : {}),
        });
    }
    getCookie(request, name) {
        const cookieHeader = request.headers.cookie;
        if (!cookieHeader) {
            return undefined;
        }
        const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
        const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
        return match
            ? decodeURIComponent(match.split('=').slice(1).join('='))
            : undefined;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new engineer/admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists.' }),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login and receive JWT' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully authenticated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials.' }),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-expected-role')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh JWT access token using HttpOnly cookie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Access token refreshed.' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Refresh token missing or invalid.',
    }),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout and clear refresh token session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map