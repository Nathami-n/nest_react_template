import {
  EmailLoginDto,
  EmailSignupDto,
  VerifyEmailDto,
  ResendOTPDto,
} from '@api/modules/auth/dto';
import { AuthService } from '@api/modules/auth/services';
import { VerificationService } from '@api/modules/auth/services/verification.service';
import { clearAuthCookies, setAuthCookies } from '@api/modules/auth/utils';
import { JwtAuthGuard, LocalAuthGuard, GoogleAuthGuard } from '@api/modules/auth/guards';
import { AppConfigService, COOKIE_NAMES, LoggerService, RawResponse } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private verificationService: VerificationService,
    private config: AppConfigService,
    private logger: LoggerService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async signup(@Body() dto: EmailSignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: EmailLoginDto })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
      deviceInfo,
    );
    setAuthCookies(res, accessToken, refreshToken);
    return { message: 'Logged in successfully' };
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const deviceInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const { accessToken, refreshToken } = await this.authService.refresh(
      oldRefreshToken,
      deviceInfo,
    );
    setAuthCookies(res, accessToken, refreshToken);
    return { message: 'Tokens refreshed' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and invalidate session' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @RawResponse()
  @ApiOperation({ summary: 'Initialize Google OAuth login' })
  async googleAuth() {
    // Guard handles redirect
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @RawResponse()
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const deviceInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
      deviceInfo,
    );
    setAuthCookies(res, accessToken, refreshToken);

    // Redirect to frontend
    return res.redirect(`${this.config.frontendUrl}/auth/success`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently logged in user info' })
  @ApiResponse({ status: 200, description: 'Returns current user' })
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @Post('verify-email')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.verificationService.verifyEmail(dto.email, dto.otp);
    return { message: 'Email verified successfully' };
  }

  @Post('resend-otp')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Resend OTP verification email' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async resendOTP(@Body() dto: ResendOTPDto) {
    await this.verificationService.resendOTP(dto.email);
    return { message: 'Verification code sent to your email' };
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({
    status: 200,
    description: 'If the email exists, a reset link will be sent',
  })
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body.email);
    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password using a valid reset token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(@Body() body: { token: string; password: string }) {
    await this.authService.resetPassword(body.token, body.password);
    return {
      message:
        'Password reset successfully. Please log in with your new password.',
    };
  }
}
