import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendEmailDto } from './email.dto';
import { SendEmailCommand } from '@aws-sdk/client-sesv2';
import { PrismaService } from 'src/services/prisma.service';
import { sesClient } from '../domain/ses';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<SendEmailDto>): Promise<void> {
    try {
      console.log(`[EMAIL_PROCESSOR] received job: ${JSON.stringify(job.id)}`);

      if (job.name === 'send-email') {
        await this.sendEmail(job.data);
        return;
      }

      throw new Error('Invalid job name');
    } catch (error) {
      console.error('Error processing job', error);
      throw error;
    }
  }

  async sendEmail(data: SendEmailDto) {
    if (data.filesIds) {
      throw new Error('Attachments are not supported yet');
    }

    let dataLog: any = { ...data };
    delete dataLog.html;

    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending email: ${dataLog}`);

    const { subject, html, from, to, messageId } = data;

    const command = new SendEmailCommand({
      FromEmailAddress: `"${from.name}" <${from.email}>`,
      Destination: {
        ToAddresses: to,
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: html,
            },
          },
        },
      },
      ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET,
    });

    const response = await sesClient.send(command);

    if (messageId) {
      await this.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          externalId: response.MessageId,
        },
      });
    }

    console.log(`[EMAIL_PROCESSOR] e-mail sent: ${dataLog}`);
  }
}
