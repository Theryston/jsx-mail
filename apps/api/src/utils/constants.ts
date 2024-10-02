export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MONEY_SCALE = 1000000;
export const GATEWAY_SCALE = 100;
export const CURRENCY = 'USD';
export const FREE_BALANCE = 1 * MONEY_SCALE; // $1.00
export const MINIMUM_ADD_BALANCE = 1 * MONEY_SCALE; // $1.00
export const STORAGE_GB_PRICE = 0.025 * MONEY_SCALE; // $0.025
export const PRICE_PER_MESSAGE = 0.0002 * MONEY_SCALE; // $0.0002

export const MESSAGES_STATUS = [
  {
    value: 'queued',
    label: 'Queued',
    description: 'The message is waiting to be sent',
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
    value: 'bonce',
    label: 'Bonce',
    description: 'The message was marked as spam',
    color: 'rgb(239 68 68)',
  },
  {
    value: 'failed',
    label: 'Failed',
    description: 'There was an error sending the message',
    color: 'rgb(239 68 68)',
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
