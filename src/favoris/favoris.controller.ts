// backend/src/favoris/favoris.controller.ts
import { Controller, Get, Post, Body, Delete, Param, Req, UseGuards, UnauthorizedException } from '@nestjs/common';

import { FavorisService } from './favoris.service';
import { CreateFavorisDto } from './dto/create-favoris.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favoris')
@UseGuards(JwtAuthGuard)
export class FavorisController {
  constructor(private readonly favorisService: FavorisService) {}

 @Post()
async create(@Body() createFavorisDto: CreateFavorisDto, @Req() req) {
  if (!req.user) {
    throw new UnauthorizedException('Utilisateur non authentifié');
  }
  const userId = req.user.id || req.user._id || req.user.sub;
  if (!userId) {
    throw new UnauthorizedException('ID utilisateur introuvable');
  }
  return this.favorisService.create(createFavorisDto, userId);
}




 @Get()
async findAll(@Req() req) {
  // console.log('req.user:', req.user);
  const userId = req.user.id || req.user._id || req.user.sub;
  // console.log('User id pour favoris:', userId);
  return this.favorisService.findAll(userId);
}



  @Delete(':bienId')
async remove(@Param('bienId') bienId: string, @Req() req) {
  if (!req.user) {
    throw new UnauthorizedException('Utilisateur non authentifié');
  }

  const userId = req.user.id || req.user._id || req.user.sub;
  if (!userId) {
    throw new UnauthorizedException('ID utilisateur introuvable');
  }

  return this.favorisService.remove(userId, bienId);
}


}
