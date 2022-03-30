import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@core/logger/logger.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appPort = process.env.PORT || 5003; //Read port from environment file or default should be 5003
  const logger = await app.resolve(LoggerService);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.indexOf(process.env.WHITELISTED_DOMAIN) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept,Authorization',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: false,
    }),
  );

  logger.verbose(`Application listening on port => ${appPort}`);
  await app.listen(appPort);
}
bootstrap();
