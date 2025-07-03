
//backend/src/schemas/favoris.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Bien } from '../schemas/bien.schema';
import { User } from '../schemas/user.schemas';

@Schema({ timestamps: true })
export class Favoris extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bien', required: true })
  bien: Bien;
}

export const FavorisSchema = SchemaFactory.createForClass(Favoris);
// Ajout d'un index unique
FavorisSchema.index({ user: 1, bien: 1 }, { unique: true });