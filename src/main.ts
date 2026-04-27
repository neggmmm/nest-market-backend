import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUri = configService.getOrThrow<string>('frontendUri');
  const port = configService.get<number>('port') ?? 3000;
  const cookieParser = require('cookie-parser');
  app.enableCors({
    origin: frontendUri,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use('/uploads', express.static('uploads'))
  await app.listen(port);
}
bootstrap();
