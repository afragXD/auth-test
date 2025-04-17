import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import IORedis from 'ioredis';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { isDev } from './utils/isDev';
import { ms, StringValue } from './utils/ms';
import { parseBoolean } from './utils/parse-boolean';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port = Number(config.getOrThrow<number>('PORT'));
  const redis = new IORedis(config.getOrThrow<string>('VALKEY_URI'));
  const redisStore = new RedisStore({
    client: redis,
    prefix: config.getOrThrow<string>('SESSION_FOLDER'),
  });

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: redisStore,
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(port, '0.0.0.0', () => {
    console.log(
      `Server started on porn: ${port} and mode ${isDev(config) ? 'development' : 'production'}`,
    );
  });
}
bootstrap();
