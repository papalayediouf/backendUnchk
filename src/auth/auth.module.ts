import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../schemas/user.schemas';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordResetModule } from './password-reset/password-reset.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule, // ← Import nécessaire pour les guards/passport
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '5h' },
        }),
    }), 
    PasswordResetModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ← Fournir la stratégie ici
})
export class AuthModule {}
