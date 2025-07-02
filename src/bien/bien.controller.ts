import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { BienService } from './bien.service';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import '../config/cloudinary.config';

const baseFolder = `unchk-immo-${process.env.APP_ENV}/biens`;

@Controller('bien')
export class BienController {
  constructor(private readonly bienService: BienService) {}

  @Post('ajouter')
  @UseInterceptors(FileInterceptor('image', {
    storage: new CloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: baseFolder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }],
      }),
    }),
  }))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const createBienDto: CreateBienDto = {
      titre: body.titre,
      type: body.type,
      statut: body.statut,
      prix: Number(body.prix),
      superficie: Number(body.superficie),
      localisation: body.localisation,
      description: body.description,
      images: file ? [file.path] : [],
    };

    return this.bienService.create(createBienDto);
  }

  @Get('liste-bien')
  async findAll() {
    return this.bienService.findAll();
  }

  @Get('archives')
  async findArchives() {
    return this.bienService.findArchives();
  }

  @Get('statistiques')
  async getStats() {
    try {
      return await this.bienService.getStatistiques();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new HttpException('Erreur serveur interne', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bienService.findOne(id);
  }

  @Patch('modifier/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: new CloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: baseFolder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }],
      }),
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateBienDto: UpdateBienDto = {
      titre: body.titre,
      type: body.type,
      statut: body.statut,
      prix: body.prix ? Number(body.prix) : undefined,
      superficie: body.superficie ? Number(body.superficie) : undefined,
      localisation: body.localisation,
      description: body.description,
      ...(file ? { images: [file.path] } : {}),
    };

    return this.bienService.update(id, updateBienDto);
  }

  @Patch('archiver/:id')
  async archiver(@Param('id') id: string) {
    return this.bienService.archiver(id);
  }

  @Patch('desarchiver/:id')
  async desarchiver(@Param('id') id: string) {
    return this.bienService.desarchiver(id);
  }

  @Delete('supprimer/:id')
  async remove(@Param('id') id: string) {
    return this.bienService.remove(id);
  }

  
}
