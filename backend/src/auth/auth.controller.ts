import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from './public.decorator';

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    fullName: string;
    email: string;
    role: string;
  };
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new engineer/admin' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Headers('x-expected-role') expectedRole: 'admin' | 'engineer' | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.login(loginDto, expectedRole);
    this.setRefreshCookie(response, session.refreshToken, loginDto.rememberMe);

    return {
      accessToken: session.accessToken,
      user: session.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT access token using HttpOnly cookie' })
  @ApiResponse({ status: 200, description: 'Access token refreshed.' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token missing or invalid.',
  })
  @Public()
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.refresh(
      this.getCookie(request, 'refreshToken'),
    );
    this.setRefreshCookie(response, session.refreshToken, true);

    return {
      accessToken: session.accessToken,
      user: session.user,
    };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.getMe({
      id: request.user?.userId || '',
      fullName: request.user?.fullName || '',
      email: request.user?.email || '',
      role: request.user?.role || '',
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear refresh token session' })
  @ApiResponse({ status: 200, description: 'Successfully logged out.' })
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('refreshToken', { path: '/api/auth' });
    return this.authService.logout(request.user?.userId);
  }

  private setRefreshCookie(
    response: Response,
    refreshToken: string,
    rememberMe?: boolean,
  ): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth',
      ...(rememberMe ? { maxAge: 7 * 24 * 60 * 60 * 1000 } : {}),
    });
  }

  private getCookie(request: Request, name: string): string | undefined {
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
}
