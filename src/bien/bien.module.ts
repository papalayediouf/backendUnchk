import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BienService } from './bien.service';
import { BienController } from './bien.controller';
import { Bien, BienSchema } from '../schemas/bien.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bien.name, schema: BienSchema }]),
  ],
  controllers: [BienController],
  providers: [BienService],
})
export class BienModule {}
