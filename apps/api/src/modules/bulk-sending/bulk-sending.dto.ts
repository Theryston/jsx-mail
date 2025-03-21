import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateBulkContactsDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  emailColumn: string;

  @IsString()
  @IsNotEmpty()
  nameColumn: string;
}

export class CreateBulkSendingVariableDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  fromKey: string;

  @IsString()
  @IsOptional()
  customValue?: string;
}

export class CreateBulkSendingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  contactGroupId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  variables: CreateBulkSendingVariableDto[];
}

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contactGroupId: string;

  @IsString()
  @IsOptional()
  contactImportId?: string;
}
