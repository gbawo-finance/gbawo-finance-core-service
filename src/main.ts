import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SecurityExceptionFilter } from './common/filters/security-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SecurityValidationPipe } from './common/security/security-validation.pipe';
import { SecurityInterceptor } from './common/security/security.interceptor';
import { SecurityService } from './common/security/security.service';
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
  app.use(
    helmet({
      contentSecurityPolicy: securityConfigService.getCSPConfig(),
      crossOriginEmbedderPolicy: false,
      hsts: false,
    }),
  );

  // Request compression
  app.use(compression());

  // Enhanced CORS configuration for internal service (from environment variables)
  interface CorsConfig {
    allowedOrigins: string[];
    credentials: boolean;
    methods: string | string[];
    allowedHeaders: string | string[];
    maxAge?: number;
  }

  type CorsOriginCallback = (err: Error | null, allow?: boolean) => void;

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: CorsOriginCallback,
    ): void => {
      // Allow requests with no origin (like mobile apps or server-to-server)
      if (!origin) return callback(null, true);

      // Get allowed origins from configuration (environment variables)
      const allowedOrigins: CorsConfig['allowedOrigins'] =
        securityConfig.cors.allowedOrigins;

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        securityService.logSecurityEvent('CORS_VIOLATION', {
          origin,
          allowedOrigins,
          timestamp: new Date().toISOString(),
        });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: (securityConfig.cors as CorsConfig).credentials,
    methods: (securityConfig.cors as CorsConfig).methods,
    allowedHeaders: (securityConfig.cors as CorsConfig).allowedHeaders,
    maxAge: (securityConfig.cors as CorsConfig).maxAge,
  });

  // Enhanced global validation pipe with security features
  app.useGlobalPipes(securityValidationPipe);

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(securityInterceptor);

  // Global exception filters
  app.useGlobalFilters(securityExceptionFilter);
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger documentation setup with security considerations
  const config = new DocumentBuilder()
    .setTitle('Gbawo Finance Core Service')
    .setDescription(
      'Core financial services API for the Gbawo Finance platform',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Gbawo Finance API Documentation',
  });

  // Get port from config service (validated at startup)
  const port = configService.get<number>('PORT')!;

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
