export type Message = {
  id: string;
  to: string;
  subject: string;
  sentAt: Date;
  sender: {
    email: string;
  };
};
