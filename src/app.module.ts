import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✅ Ajouter cette ligne
import { BienModule } from './bien/bien.module';
import { FavorisModule } from './favoris/favoris.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Rendre ConfigModule accessible partout
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UserModule,
    AuthModule,
    BienModule,
    FavorisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
