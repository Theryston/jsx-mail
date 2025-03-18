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
