import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { parseFormData } from './utils/parse-form-data';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
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
  let response = await server(event, context, callback);
  response = {
    ...response, headers: { ...response.headers, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true }
  };
  return response;
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

    const fileStr = JSON.stringify(body.file);

    event.body = Buffer.from(fileStr);
    return event
  } catch (error) {
    console.log(error)
  }
}
