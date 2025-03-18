export type ContactListItem = {
  id: string;
  name: string;
  createdAt: Date;
  contactsCount: number;
};

export type ContactGroupsPagination = {
  contactGroups: ContactListItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};
