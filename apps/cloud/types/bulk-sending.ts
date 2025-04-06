export type ContactGroupListItem = {
  id: string;
  name: string;
  createdAt: Date;
  contactsCount: number;
  validContactsCount: number;
};

export type ContactListItem = {
  id: string;
  name: string;
  email: string;
  bouncedAt: Date | null;
  bouncedBy: string | null;
  createdAt: Date;
};

export type ContactGroupPagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export type ContactGroupsPagination = ContactGroupPagination & {
  contactGroups: ContactGroupListItem[];
};

export type ContactGroupContactsPagination = ContactGroupPagination & {
  contacts: ContactListItem[];
};

export type ContactGroup = {
  id: string;
  name: string;
  createdAt: Date;
  contactsCount: number;
  validContactsCount: number;
};

export type ContactImport = {
  id: string;
  fileId: string;
  emailColumn: string;
  nameColumn: string;
  userId: string;
  totalLines: number;
  processedLines: number;
  readFinalStatusAt: Date | null;
  contactGroupId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  _count: {
    failures: number;
    contacts: number;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ContactImportFailure = {
  id: string;
  contactImportId: string;
  createdAt: Date;
  line: number | null;
  message: string;
};

export type ContactImportFailuresPagination = ContactGroupPagination & {
  failures: ContactImportFailure[];
};

export type BulkSending = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  subject: string;
  content: string;
  senderId: string;
  totalContacts: number;
  processedContacts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  contactGroupId: string;
  _count: {
    messages: number;
    failures: number;
  };
};

export type BulkSendingVariable = {
  key: string;
  from: string;
  fromKey: string;
  isMapped: boolean;
  description?: string;
  placements: ('subject' | 'content')[];
  customValue?: string;
  isDefault?: boolean;
};

export type BulkSendingPagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export type BulkSendingsPagination = BulkSendingPagination & {
  bulkSendings: BulkSending[];
};

export type BulkSendingFailuresPagination = BulkSendingPagination & {
  failures: BulkSendingFailure[];
};

export type BulkSendingFailure = {
  id: string;
  createdAt: string;
  updatedAt: string;
  bulkSendingId: string;
  message: string;
  contactId: string | null;
  line: number | null;
};

export type BulkEmailCheck = {
  id: string;
  createdAt: string;
  updatedAt: string;
  contactGroupId: string;
  totalEmails: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bouncedEmails: number;
  processedEmails: number;
  startedAt: string;
  estimatedEndAt: string;
  estimatedEndSeconds: number;
  failedEmails: number;
};

export type BulkEmailCheckEstimate = {
  estimatedCost: number;
  friendlyEstimatedCost: string;
  estimatedTimeSeconds: number;
  friendlyEstimatedTime: string;
  contactsCount: number;
};
