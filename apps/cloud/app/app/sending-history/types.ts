export type Message = {
  id: string;
  to: string;
  subject: string;
  sentAt: Date;
  status: string;
  sender: {
    email: string;
  };
};
