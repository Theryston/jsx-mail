import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export type CustomFile = {
  buffer: Buffer;
  originalname: string;
  size: number;
  mimetype: string;
  encoding: string;
};

@Injectable()
export class FileInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const body = JSON.parse(request.body.toString());

    const fileBuffer = Buffer.from(body.content);

    const file: CustomFile = {
      buffer: fileBuffer,
      encoding: body.filename.encoding,
      mimetype: body._jsxmail_mimetype || body.filename.mimeType,
      originalname: body._jsxmail_originalname || body.filename.filename,
      size: fileBuffer.length,
    };

    request.file = file;
    delete request.body;
    return next.handle();
  }
}
