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
  failures: {
    message: string;
    line?: number;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
