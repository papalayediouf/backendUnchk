import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BienDocument = Bien & Document;

@Schema()
export class Bien {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  statut: string;

  @Prop({ required: true })
  prix: number;

  @Prop({ required: true })
  superficie: number;

  @Prop({ required: true })
  localisation: string;

  @Prop()
  description?: string;

  @Prop([String])
  images?: string[];

  @Prop({ default: false }) // 👈 champ archive ajouté
  archive: boolean;
}

export const BienSchema = SchemaFactory.createForClass(Bien);
