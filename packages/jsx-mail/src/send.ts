import axios from 'axios';
import render from './render';

type Data = {
  subject: string;
  to: string[];
  props?: any;
};

export default async function send(templateName: string, data: Data) {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const jsxMailToken = process.env.JSX_MAIL_TOKEN;

  if (!jsxMailToken) {
    throw new Error('The env JSX_MAIL_TOKEN was not found');
  }

  const html = await render(templateName, data.props);

  const { data: result } = await axios.post(
    `https://jsxmail.org/api/mail/send`,
    {
      html,
      subject: data.subject,
      to: data.to,
    },
    {
      headers: {
        Authorization: `Bearer ${jsxMailToken}`,
      },
    },
  );

  return result as { message: 'SENT' };
}
