import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { parseFormData } from './utils/parse-form-data';
import rawBodyMiddleware from './rawBodyMiddleware';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(rawBodyMiddleware());
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  event = await handleMultipart(event);
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};

async function handleMultipart(event) {
  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];

    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      return event
    }

    const body = await parseFormData({
      body: event.body,
      isBase64Encoded: event.isBase64Encoded,
      contentType
    });

    if (!body.file) {
      return event
    }

    const fileStr = JSON.stringify({
      ...body.file,
      ...body.fields
    });

    event.body = Buffer.from(fileStr);
    return event
  } catch (error) {
    console.log(error)
  }
}
