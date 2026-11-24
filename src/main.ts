import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe with class-validator
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

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // CORS is handled by Nginx gateway - disable here to avoid conflicts
  // app.enableCors() is NOT needed when running behind reverse proxy

  const port = configService.get<number>('SERVICE_PORT', 4040);
  const serviceName = configService.get<string>(
    'SERVICE_NAME',
    'procurement-inventory-service',
  );

  await app.listen(port, '0.0.0.0');
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🚀 ${serviceName} running on port ${port}                 ║
║  📍 API Endpoint: http://localhost:${port}/api/v1          ║
║  🔄 Environment: ${process.env.NODE_ENV || 'development'}  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
