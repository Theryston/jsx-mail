import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsArray,
  IsOptional,
  IsString,
  IsObject,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { EmailPriority } from '../email/email.dto';

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
  attachmentIds?: string[];

  @IsOptional()
  @IsString()
  bulkSendingId?: string;

  @IsOptional()
  @IsObject()
  customPayload?: Record<string, any>;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsNumber()
  delay?: number;

  @IsOptional()
  @IsEnum(EmailPriority)
  priority?: EmailPriority;
}
