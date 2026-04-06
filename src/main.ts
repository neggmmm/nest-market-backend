import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cookieParser = require('cookie-parser');
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads', express.static('uploads'))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
