import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../email.dto';
import { EmailClient } from '@azure/communication-email';

@Injectable()
export class SendEmailService {
  async execute({ subject, html, from, to }: SendEmailDto) {
    const emailClient = new EmailClient(
      process.env.AZURE_SERVICE_ENDPOINT as string,
    );

    const poller = await emailClient.beginSend({
      senderAddress: from.email,
      content: {
        subject,
        html,
      },
      recipients: {
        to: to.map((t) => ({
          address: t,
        })),
      },
    });

    if (!poller.getOperationState().isStarted) {
      throw 'Poller was not started.';
    }
  }
}
