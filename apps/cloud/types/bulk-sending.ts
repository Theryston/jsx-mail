export type ContactGroupListItem = {
  id: string;
  name: string;
  createdAt: Date;
  contactsCount: number;
};

export type ContactListItem = {
  id: string;
  name: string;
  email: string;
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
