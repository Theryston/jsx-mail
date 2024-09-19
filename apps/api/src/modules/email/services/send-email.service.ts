import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../email.dto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class SendEmailService {
  async execute({ subject, html, from, to }: SendEmailDto) {
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

    return await clientSES.send(command);
  }
}
