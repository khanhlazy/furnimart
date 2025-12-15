"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/exceptions/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    // Thêm dòng này để prefix tất cả route với /api
    app.setGlobalPrefix('api');
    // Enable CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Global Pipes
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    // Global Filters & Interceptors
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    // Security Headers Middleware
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
    });
    // Swagger Documentation
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FurniMart API')
        .setDescription('FurniMart - Nền tảng thương mại điện tử nội thất')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const PORT = process.env.PORT || 3001;
    await app.listen(PORT);
    const env = process.env.NODE_ENV || 'development';
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 FurniMart Backend Server 🚀      ║
╠═══════════════════════════════════════╣
║ Environment: ${env.padEnd(27)}║
║ Port: ${PORT.toString().padEnd(32)}║
║ URL: http://localhost:${PORT.toString().padEnd(26)}║
║ Health: /health ${' '.repeat(24)}║
║ Swagger: /api/docs ${' '.repeat(18)}║
║ CORS: http://localhost:3000 ${' '.repeat(12)}║
╚═══════════════════════════════════════╝
  `);
}
bootstrap().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map