import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RegisterDto, LoginDto, LoginOtpDto, VerifyEmailDto, SendOtpDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Registration successful. Please check your email for verification OTP.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const { user, tokens } = await this.authService.login(loginDto.email, loginDto.password);
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        },
        tokens,
      },
    };
  }

  @Post('login/otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with OTP' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid OTP' })
  async loginWithOTP(@Body() loginOtpDto: LoginOtpDto) {
    const { user, tokens } = await this.authService.loginWithOTP(
      loginOtpDto.email,
      loginOtpDto.otp,
    );
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        },
        tokens,
      },
    };
  }

  @Post('send-login-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP for login' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendLoginOTP(@Body() sendOtpDto: SendOtpDto) {
    await this.authService.sendLoginOTP(sendOtpDto.email);
    return {
      success: true,
      message: 'OTP sent to your email',
    };
  }

  @Post('send-verification-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send email verification OTP' })
  @ApiResponse({ status: 200, description: 'Verification OTP sent successfully' })
  async sendVerificationOTP(@Body() sendOtpDto: SendOtpDto) {
    await this.authService.sendVerificationOTP(sendOtpDto.email);
    return {
      success: true,
      message: 'Verification OTP sent to your email',
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.authService.verifyEmail(verifyEmailDto.email, verifyEmailDto.otp);
    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const { user, tokens } = await this.authService.refreshToken(refreshToken);
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        },
        tokens,
      },
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Body('refreshToken') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from all sessions' })
  @ApiResponse({ status: 200, description: 'Logged out from all sessions successfully' })
  async logoutAll(@Request() req) {
    await this.authService.logoutAll(req.user.id);
    return {
      success: true,
      message: 'Logged out from all sessions successfully',
    };
  }
}
