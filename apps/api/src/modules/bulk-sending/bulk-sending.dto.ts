export class CreateContactGroupDto {
  name: string;
}

export class CreateBulkContactsDto {
  fileId: string;
  emailColumn: string;
  nameColumn: string;
}

export class CreateBulkSendingDto {
  subject: string;
  content: string;
  sender: string;
  contactGroupId: string;
}
