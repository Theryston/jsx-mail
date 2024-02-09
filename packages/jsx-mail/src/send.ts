import render from './render';
import requestLogin from './request-login';

type Data = {
  subject: string;
  to: string[];
  props?: any;
};

export default async function send(templateName: string, data: Data) {
  await requestLogin()
  const html = await render(templateName, data);
  console.log(html);
  // TODO: send email
}
