import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../email.dto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class SendEmailService {
  async execute({ subject, html, from, to }: SendEmailDto) {
    const clientSES = new SESClient();

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
