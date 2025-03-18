export class CreateContactGroupDto {
  name: string;
}

export class CreateBulkContactsDto {
  fileId: string;
  emailColumn: string;
  nameColumn: string;
}
