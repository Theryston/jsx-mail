import { EmailCheckResult } from '@prisma/client';

export const MONEY_SCALE = 1000000;
export const GATEWAY_SCALE = 100;
export const EMAIL_CHECK_ATTEMPTS = 3;
export const EMAIL_CHECK_DELAY = 1000 * 30;
export const CURRENCY = 'USD';

export const VALID_EMAIL_CHECK_RESULT: EmailCheckResult[] = [
  'ok',
  'risky',
  'unknown',
  'accept_all',
];

export const SAFELY_VALID_EMAIL_CHECK_RESULT: EmailCheckResult[] = ['ok'];

export const BULK_EMAIL_CHECK_STATUS_MAP = {
  pending: 'pending',
  pending_processing: 'pending',
  processing: 'processing',
  completed: 'completed',
};

export const EMAIL_CHECK_RESULT_MAP: Record<string, EmailCheckResult> = {
  ok: 'ok',
  email_invalid: 'email_invalid',
  risky: 'risky',
  unknown: 'unknown',
  accept_all: 'accept_all',
};

export const MESSAGES_STATUS = [
  {
    value: 'queued',
    label: 'Queued',
    description: 'The message is waiting to be sent',
    color: 'rgb(234 179 8)',
  },
  {
    value: 'processing',
    label: 'Processing',
    description: 'The message is being processed',
    color: 'rgb(234 179 8)',
  },
  {
    value: 'sent',
    label: 'Sent',
    description:
      'The message was sent (not delivered yet just sent to the recipient)',
    color: 'rgb(168 85 247)',
  },
  {
    value: 'bounce',
    label: 'Bounce',
    description:
      "A hard bounce that the recipient's mail server permanently rejected the email.",
    color: 'rgb(239 68 68)',
  },
  {
    value: 'failed',
    label: 'Failed',
    description: 'There was an error sending the message',
    color: 'rgb(239 68 68)',
  },
  {
    value: 'reject',
    label: 'Reject',
    description:
      "JSX Mail Cloud accepted the email, but determined that it contained a virus and didn't attempt to deliver it to the recipient's mail server.",
    color: 'rgb(239 68 68)',
  },
  {
    value: 'complaint',
    label: 'Complaint',
    description:
      "The email was successfully delivered to the recipient's mail server, but the recipient marked it as spam.",
  },
  {
    value: 'delivery_delayed',
    label: 'Delivery Delayed',
    description:
      "The email couldn't be delivered to the recipient's mail server because a temporary issue occurred. Delivery delays can occur, for example, when the recipient's inbox is full, or when the receiving email server experiences a transient issue.",
  },
  {
    value: 'subscription',
    label: 'Subscription',
    description:
      'he email was successfully delivered, but the recipient unsubscribed.',
  },
  {
    value: 'delivered',
    label: 'Delivered',
    description: 'The message was delivered successfully',
    color: 'rgb(34 197 94)',
  },
  {
    value: 'opened',
    label: 'Opened',
    description: 'The recipient opened the message',
    color: 'rgb(59 130 246)',
  },
  {
    value: 'clicked',
    label: 'Clicked',
    description: 'The recipient clicked in some link in the message',
    color: 'rgb(132 204 22)',
  },
];
