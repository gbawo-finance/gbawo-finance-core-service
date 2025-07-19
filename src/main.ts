import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as mongoSanitize from 'express-mongo-sanitize';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SecurityService } from './common/security/security.service';
import { SecurityInterceptor } from './common/security/security.interceptor';
import { SecurityValidationPipe } from './common/security/security-validation.pipe';
import { SecurityExceptionFilter } from './common/filters/security-exception.filter';
import { SecurityConfigService } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const securityService = app.get(SecurityService);
  const securityConfigService = app.get(SecurityConfigService);
  const securityInterceptor = app.get(SecurityInterceptor);
  const securityValidationPipe = app.get(SecurityValidationPipe);
  const securityExceptionFilter = app.get(SecurityExceptionFilter);
  
  // Security headers with Helmet (configured for internal service)
  const securityConfig = securityConfigService.getSecurityConfig();
  app.use(helmet({
    contentSecurityPolicy: securityConfigService.getCSPConfig(),
    crossOriginEmbedderPolicy: false, // Disable for internal service compatibility
    hsts: false, // Disable HSTS as requested (no HTTPS requirement)
  }));

  // Request compression
  app.use(compression());

  // Note: Temporarily commented out mongo sanitization due to compatibility issues
  // TODO: Implement custom sanitization solution
  // app.use(mongoSanitize());

  // Enhanced CORS configuration for internal service (from environment variables)
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or server-to-server)
      if (!origin) return callback(null, true);
      
      // Get allowed origins from configuration (environment variables)
      const allowedOrigins = securityConfig.cors.allowedOrigins;
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        securityService.logSecurityEvent('CORS_VIOLATION', { 
          origin, 
          allowedOrigins, 
          timestamp: new Date().toISOString() 
        });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: securityConfig.cors.credentials,
    methods: securityConfig.cors.methods,
    allowedHeaders: securityConfig.cors.allowedHeaders,
    maxAge: securityConfig.cors.maxAge,
  });

  // Enhanced global validation pipe with security features
  app.useGlobalPipes(securityValidationPipe);

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(securityInterceptor);

  // Global exception filters
  app.useGlobalFilters(securityExceptionFilter);
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global prefix for API routes
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'health/simple']
  });

  // Swagger documentation setup with security considerations
  const config = new DocumentBuilder()
    .setTitle('Gbawo Finance Core Service')
    .setDescription('Core financial services API for the Gbawo Finance platform')
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addTag('security', 'Security-related endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Gbawo Finance API Documentation',
    customfavIcon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text y="14" font-size="16">🏦</text></svg>',
  });

  // Get port from config service (validated at startup)
  const port = configService.get<number>('PORT')!;

  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
  console.log(`🛡️  Security measures enabled for internal service`);
  
  // Log startup security configuration
  securityService.logSecurityEvent('SERVICE_STARTED', {
    port,
    timestamp: new Date().toISOString(),
    securityFeatures: ['helmet', 'compression', 'input-sanitization', 'cors', 'validation']
  });
}
bootstrap();
