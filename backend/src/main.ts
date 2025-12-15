import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { AppModule } from './app.module';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Thêm dòng này để prefix tất cả route với /api
  app.setGlobalPrefix('api');

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'];
  
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Security Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('FurniMart API')
    .setDescription('FurniMart - Nền tảng thương mại điện tử nội thất')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);

  const env = process.env.NODE_ENV || 'development';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 FurniMart Backend Server 🚀      ║
╠═══════════════════════════════════════╣
║ Environment: ${env.padEnd(27)}║
║ Port: ${PORT.toString().padEnd(32)}║
║ URL: http://localhost:${PORT.toString().padEnd(26)}║
║ Health: /api/health ${' '.repeat(22)}║
║ Swagger: /api/docs ${' '.repeat(18)}║
║ CORS: ${frontendUrl.padEnd(30)}║
╚═══════════════════════════════════════╝
  `);
}

bootstrap().catch((err: Error) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
