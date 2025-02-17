import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendEmailDto } from './email.dto';
import {
  SendEmailCommand,
  SendRawEmailCommand,
  SESClient,
} from '@aws-sdk/client-ses';
import { PrismaService } from 'src/services/prisma.service';
import MailComposer from 'nodemailer/lib/mail-composer';
import axios from 'axios';

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

  async sendEmailWithAttachments(data: SendEmailDto) {
    let dataLog: any = { ...data };
    delete dataLog.html;
    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending raw email: ${dataLog}`);

    const rawMessage = await this.buildRawMessage(data);

    const clientSES = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new SendRawEmailCommand({
      RawMessage: { Data: rawMessage },
      ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET,
    });

    const response = await clientSES.send(command);

    if (data.messageId) {
      await this.prisma.message.update({
        where: { id: data.messageId },
        data: { externalId: response.MessageId },
      });
    }

    console.log(`[EMAIL_PROCESSOR] email sent with attachment`);
  }

  async buildRawMessage(data: SendEmailDto): Promise<Buffer> {
    const { subject, html, from, to, filesIds } = data;

    const files = await this.prisma.file.findMany({
      where: {
        id: {
          in: filesIds,
        },
      },
    });

    const attachmentsPromises = files?.map(async (att) => {
      const arrayBuffer = await axios.get(att.url, {
        responseType: 'arraybuffer',
      });

      const buffer = Buffer.from(arrayBuffer.data);

      return {
        filename: att.originalName,
        content: buffer,
        contentType: att.mimeType,
      };
    });

    const attachments = await Promise.all(attachmentsPromises);

    console.log(
      `[EMAIL_PROCESSOR] attachments: ${JSON.stringify(
        attachments.map((att) => att.filename),
      )}`,
    );

    const mailOptions = {
      from: `"${from.name}" <${from.email}>`,
      to: to.join(', '),
      subject,
      html,
      attachments,
    };

    const mail = new MailComposer(mailOptions);

    return new Promise((resolve, reject) => {
      mail.compile().build((err, message) => {
        if (err) {
          return reject(err);
        }
        resolve(message);
      });
    });
  }

  async sendEmail(data: SendEmailDto) {
    if (data.filesIds) {
      return await this.sendEmailWithAttachments(data);
    }

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
      ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET,
    });

    const response = await clientSES.send(command);

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

    console.log(`[EMAIL_PROCESSOR] email sent: ${dataLog}`);
  }
}
