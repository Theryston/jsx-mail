import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../email.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SendEmailService {
  constructor(@InjectQueue('email') private readonly sendEmailQueue: Queue) {}

  async execute(data: SendEmailDto) {
    await this.sendEmailQueue.add('send-email', data, { attempts: 3 });
    const newData = { ...data };
    delete newData.html;
    console.log(
      `[SEND_EMAIL_SERVICE] added job to queue: ${JSON.stringify(newData)}`,
    );
  }
}
