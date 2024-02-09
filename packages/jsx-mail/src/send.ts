import render from './render';
import requestLogin from './request-login';
import { getJsxMailConfig } from './utils/get-config';
import core from '@jsx-mail/core';

type Data = {
  subject: string;
  to: string[];
  sender?: string;
  props?: any;
};

type Message = {
  id: string;
  subject: string;
  senderId: string;
  userId: string;
  to: string[];
  sentAt?: Date;
  status: 'queued' | 'sent' | 'failed' | 'delivered' | 'opened' | 'clicked';
}

export default async function send(templateName: string, data: Data) {
  await requestLogin()
  const html = await render(templateName, data);
  const config = getJsxMailConfig();
  const sender = data.sender || config.defaultSender;

  const { data: message } = await core.cloudClient.post('/sender/send', {
    subject: data.subject,
    html,
    sender,
    to: data.to
  })

  const newMessage: Message = {
    ...message,
    sentAt: new Date(message.sentAt)
  }

  if (!message.sentAt) {
    delete newMessage.sentAt
  }

  return newMessage
}
