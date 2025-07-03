// src/favoris/favoris.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Favoris, FavorisSchema } from '../schemas/favoris.schema';
import { FavorisService } from './favoris.service';
import { FavorisController } from './favoris.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Favoris.name, schema: FavorisSchema }])
  ],
  controllers: [FavorisController],
  providers: [FavorisService],
})
export class FavorisModule {}
