import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // giống /api trong Express
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') || true,
    credentials: true,
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
