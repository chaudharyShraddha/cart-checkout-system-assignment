/**
 * Backend Application - Main Entry Point
 * 
 * Single Nest.js application handling:
 * - Cart management
 * - Checkout and order processing
 * - Discount code validation and generation
 * - Admin operations and statistics
 * 
 * Port: 3001
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('E-commerce Cart & Checkout API')
    .setDescription(
      'API documentation for the e-commerce cart and checkout system. ' +
      'Includes cart management, checkout processing, discount codes, and admin operations.',
    )
    .setVersion('1.0')
    .addTag('cart', 'Cart management operations')
    .addTag('checkout', 'Checkout and order processing')
    .addTag('discount', 'Discount code management')
    .addTag('admin', 'Admin operations and statistics')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'E-commerce API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend API is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();

