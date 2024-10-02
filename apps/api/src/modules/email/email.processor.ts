import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendEmailDto } from './email.dto';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<SendEmailDto>): Promise<void> {
    console.log(`[EMAIL_PROCESSOR] received job: ${JSON.stringify(job.id)}`);

    if (job.name === 'send-email') {
      await this.sendEmail(job.data);
      return;
    }

    throw new Error('Invalid job name');
  }

  async sendEmail(data: SendEmailDto) {
    let dataLog: any = { ...data };
    delete dataLog.html;
    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending email: ${dataLog}`);

    const { subject, html, from, to, messageId } = data;

    const clientSES = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new SendEmailCommand({
      Source: `"${from.name}" <${from.email}>`,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: html,
          },
        },
      },
    });

    const response = await clientSES.send(command);

    if (messageId) {
      await this.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          status: 'sent',
          sentAt: new Date(),
          sentDay: moment().format('YYYY-MM-DD'),
          externalId: response.MessageId,
        },
      });
    }

    console.log(`[EMAIL_PROCESSOR] email sent: ${dataLog}`);
  }
}
