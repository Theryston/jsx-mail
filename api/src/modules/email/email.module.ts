import { Module } from '@nestjs/common';
import { SendEmailService } from './services/send-email.service';

@Module({
  providers: [SendEmailService],
  exports: [SendEmailService],
})
export class EmailModule { }
