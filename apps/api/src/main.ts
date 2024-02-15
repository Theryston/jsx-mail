import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // @ts-ignore
  const isBun = typeof Bun !== 'undefined';
  console.log(`Running on ${isBun ? 'bun' : 'node'}`);

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3331);
}

bootstrap();
