export type File = {
  id: string;
  encoding: string;
  mimeType: string;
  originalName: string;
  size: number;
  key: string;
  url: string;
  hash: string;
  createdAt: Date;
};

export type FilesPagination = {
  files: File[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};
