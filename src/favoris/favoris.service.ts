// src/favoris/favoris.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favoris } from '../schemas/favoris.schema';
import { CreateFavorisDto } from './dto/create-favoris.dto';

@Injectable()
export class FavorisService {
  constructor(
    @InjectModel(Favoris.name) private favorisModel: Model<Favoris>,
  ) {}

  async create(createFavorisDto: CreateFavorisDto, userId: string) {
  const alreadyExists = await this.favorisModel.findOne({
    user: userId,
    bien: createFavorisDto.bienId,
  });

  if (alreadyExists) {
    return alreadyExists; // ou tu peux throw une erreur si tu veux empêcher
  }

  const favori = new this.favorisModel({
    user: userId,
    bien: createFavorisDto.bienId,
  });

  return favori.save();
}


  async findAll(userId: string) {
    return this.favorisModel.find({ user: userId }).populate('bien');
  }

 async remove(userId: string, bienId: string) {
  return this.favorisModel.findOneAndDelete({ user: userId, bien: bienId });
}


}
