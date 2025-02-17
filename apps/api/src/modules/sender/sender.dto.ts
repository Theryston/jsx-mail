import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateSenderDto {
  @IsNotEmpty()
  @Length(3, 100)
  username: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  domainName: string;
}

export class SenderSendEmailDto {
  @IsNotEmpty()
  @Length(3, 100)
  subject: string;

  @IsNotEmpty()
  @Length(3, 99999)
  html: string;

  @IsOptional()
  @IsEmail()
  sender?: string;

  @IsNotEmpty()
  @IsNotEmpty({ each: true })
  @IsArray()
  to: string[];

  @IsOptional()
  @IsArray()
  filesIds?: string[];
}
