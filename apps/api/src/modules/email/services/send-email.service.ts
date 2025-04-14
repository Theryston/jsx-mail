import { Injectable } from '@nestjs/common';
import { SendEmailDto, EmailPriority } from '../email.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SendEmailService {
  constructor(@InjectQueue('email') private readonly sendEmailQueue: Queue) {}

  async execute(data: SendEmailDto) {
    const priority = data.priority === EmailPriority.HIGH ? 1 : 10;

    await this.sendEmailQueue.add('send-email', data, {
      attempts: 3,
      delay: data.delay,
      priority,
    });

    const newData = { ...data, priority };
    delete newData.html;
    console.log(
      `[SEND_EMAIL_SERVICE] added job to queue: ${JSON.stringify(newData)}`,
    );
  }
}
