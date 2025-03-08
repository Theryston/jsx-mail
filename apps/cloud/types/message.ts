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

export type MessagesPagination = {
  messages: Message[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export type Status = {
  value: string;
  label: string;
  description: string;
};

export type MessageInsight = {
  status: string;
  days: number[];
  color: string;
};

export type MessageInsightsResponse = {
  DAYS: string[];
  STATUSES: string[];
  MESSAGES: MessageInsight[];
};
