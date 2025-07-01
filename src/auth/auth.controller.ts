import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Route pour inscription
  @Post('inscription')
  async inscription(@Body() createAuthDto: CreateAuthDto): Promise<string> {
    return this.authService.inscription(createAuthDto);
  }

  // Route pour connexion
  @Post('connexion')
  async connexion(@Body() createAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
    return this.authService.connexion(createAuthDto);
  }

  // Route pour mot de passe oublié
@Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<string> {
    return this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
  }
}
