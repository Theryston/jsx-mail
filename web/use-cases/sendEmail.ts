/* eslint-disable turbo/no-undeclared-env-vars */
import { EmailClient } from '@azure/communication-email';

type Params = {
  subject: string;
  html: string;
  from: string;
  to: string[];
};

const emailClient = new EmailClient(
  process.env.AZURE_SERVICE_ENDPOINT as string,
);

export default async function sendEmail({ subject, html, from, to }: Params) {
  const poller = await emailClient.beginSend({
    senderAddress: from,
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
