import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendEmailDto } from './email.dto';
import * as aws from '@aws-sdk/client-ses';
import { PrismaService } from 'src/services/prisma.service';
import { sesClient } from '../domain/ses';
import nodemailer from 'nodemailer';
import axios from 'axios';

const transporter = nodemailer.createTransport({
  SES: { aws, ses: sesClient },
});

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
    let dataLog: any = { ...data };
    delete dataLog.html;

    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending email: ${dataLog}`);

    const { subject, html, from, to, messageId, filesIds } = data;

    let attachments: any[] = [];

    if (filesIds) {
      const files = await this.prisma.file.findMany({
        where: { id: { in: filesIds } },
      });

      for (const file of files) {
        const { data: bytes } = await axios.get(file.url, {
          responseType: 'arraybuffer',
        });

        const base64 = Buffer.from(bytes).toString('base64');

        attachments.push({
          filename: file.originalName,
          content: base64,
          encoding: 'base64',
        });
      }
    }

    const { response: externalMessageId } = await transporter.sendMail({
      from: `"${from.name}" <${from.email}>`,
      to,
      subject,
      html,
      attachments,
    });

    if (messageId) {
      await this.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          externalId: externalMessageId,
        },
      });

      console.log(
        `[EMAIL_PROCESSOR] updated message: ${messageId} to add externalId: ${externalMessageId}`,
      );
    }

    console.log(`[EMAIL_PROCESSOR] email sent: ${dataLog}`);
  }
}
