import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../schemas/user.schemas';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule, // ← Import nécessaire pour les guards/passport
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ta_clef_secrete_super_secure', // idéalement dans .env
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ← Fournir la stratégie ici
})
export class AuthModule {}
