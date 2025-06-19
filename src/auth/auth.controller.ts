import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

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
  async connexion(@Body() createAuthDto: CreateAuthDto): Promise<string> {
    return this.authService.connexion(createAuthDto);
  }
}
