import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
type AuthenticatedRequest = Request & {
    user?: {
        userId: string;
        fullName: string;
        email: string;
        role: string;
    };
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: string;
    }>;
    login(loginDto: LoginDto, expectedRole: 'admin' | 'engineer' | undefined, response: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            role: string;
        };
    }>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            role: string;
        };
    }>;
    me(request: AuthenticatedRequest): {
        user: {
            id: string;
            fullName: string;
            email: string;
            role: string;
        };
    };
    logout(request: AuthenticatedRequest, response: Response): Promise<{
        message: string;
    }>;
    private setRefreshCookie;
    private getCookie;
}
export {};
