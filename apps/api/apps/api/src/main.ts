import {
    AppConfigService,
    LoggerService,
    ResponseWrapperInterceptor,
    HttpExceptionFilter,
} from '@app/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ApiModule } from '@api/api.module';

async function bootstrap() {
    const app = await NestFactory.create(ApiModule);

    const configService = app.get(AppConfigService);
    const logger = app.get(LoggerService);

    const port = configService.port || 3000;
    app.useLogger(logger);

    app.use(helmet());

    const corsOrigins = configService.corsOrigins;
    logger.log(`CORS enabled for origins: ${corsOrigins.join(', ')}`);

    app.enableCors({
        origin: corsOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    // Parse cookies
    app.use(cookieParser());

    // Global validation pipe for DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Global response wrapper interceptor
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ResponseWrapperInterceptor(reflector));

    // Global exception filter for consistent error responses
    app.useGlobalFilters(new HttpExceptionFilter());

    // Set global prefix and enable versioning
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    const config = new DocumentBuilder()
        .setTitle('NestJS API Template')
        .setDescription('NestJS API with authentication and example module')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(port, '0.0.0.0');

    logger.log(` API running on: http://0.0.0.0:${port}/api/v1`);
    logger.log(` API docs: http://localhost:${port}/api/docs`);
}
bootstrap();
