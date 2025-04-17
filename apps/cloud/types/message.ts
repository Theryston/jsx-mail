export type Message = {
  id: string;
  to: string[];
  subject: string;
  sentAt: Date;
  status: string;
  webhookUrl: string;
  webhookStatus: string[];
  sender: {
    email: string;
  };
};

export type StatusHistory = {
  id: string;
  createdAt: Date;
  description: string;
  status: string;
};

export type FullMessage = Message & {
  statusHistory: StatusHistory[];
  attachments: {
    id: string;
    fileName: string;
  }[];
  messageFiles: {
    file: {
      id: string;
      mimeType: string;
      originalName: string;
      size: number;
      url: string;
    };
  }[];
  body: string; // The HTML body of the message
  sender: {
    email: string;
    name: string;
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
  color: string;
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
  PROCESSING_MESSAGES: number;
};
