import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http/filters/http-exception.filter';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import * as express from 'express';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';
config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
        cors: {
            origin: process.env.ORIGIN || '*',
            credentials: false,
        },
    });

    app.useWebSocketAdapter(new IoAdapter(app));

    const port = process.env.PORT || 3000;

    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: '50mb' }));

    // Increase the limit for form data
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.use(
        '/api/uploads',
        (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Methods',
                'GET,HEAD,OPTIONS,POST,PUT',
            );
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            );
            res.header('Cross-Origin-Resource-Policy', 'cross-origin');
            next();
        },
        express.static('uploads'),
    );

    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    const config = new DocumentBuilder()
        .setTitle('Collections API')
        .setDescription('Collections API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    await app.listen(port, () =>
        console.log(`🚀 Server listening on port ${port} 🚀`),
    );
}

bootstrap();
