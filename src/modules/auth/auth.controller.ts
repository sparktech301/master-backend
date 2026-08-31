import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type * as express from 'express';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  requestOtp(@Body() data: RequestOtpDto, @Req() req: express.Request) {
    const ip = req.ip;
    return this.authService.requestOtp(data, ip);
  }

  @Post('verify-otp')
  verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data);
  }

  @Post('refresh')
  refresh(@Body() data: RefreshTokenDto, @Req() req: express.Request) {
    return this.authService.refreshToken(data.refreshToken, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
  }

  @Post('logout')
  logout(@Body() data: RefreshTokenDto) {
    return this.authService.logout(data.refreshToken);
  }

  @UseGuards()
  @Patch('complete-profile')
  completeProfile(@Body() data: CompleteProfileDto) {
    return this.authService.completeProfile(data.userId, data);
  }
}
