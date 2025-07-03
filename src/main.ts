import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active CORS pour autoriser ton frontend (ici localhost:5173)
  app.enableCors({
    origin: 'http://localhost:5173',  // adapte selon le port de ton frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

   // 🔐 Activation de la validation des DTOs(Mais actuelment il est false parceque le createDTO n'as pas de validator)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false, // Enlève les champs inconnus
    forbidNonWhitelisted: false, // Erreur si champ non autorisé
    transform: false, // Convertit les types automatiquement
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
