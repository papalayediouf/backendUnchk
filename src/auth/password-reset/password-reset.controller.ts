import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('auth/password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('forgot')
  forgot(@Body() dto: ForgotPasswordDto) {
    return this.passwordResetService.forgotPassword(dto.email);
  }

  @Post('reset')
  reset(@Body() dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto.email, dto.code, dto.newPassword);
  }
}
