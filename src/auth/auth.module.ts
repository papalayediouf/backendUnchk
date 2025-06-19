import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schemas'; // ou le bon chemin

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ✅ Injection du modèle
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
