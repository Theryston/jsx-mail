export type Message = {
  id: string;
  to: string;
  sentAt: Date;
  sender: {
    email: string;
  };
};
