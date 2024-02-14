/* eslint-disable turbo/no-undeclared-env-vars */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

type Params = {
  subject: string;
  html: string;
  from: {
    name: string;
    email: string;
  };
  to: string[];
};

const clientSES = new SESClient();

export default async function sendEmail({ subject, html, from, to }: Params) {
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

  await clientSES.send(command);
}
