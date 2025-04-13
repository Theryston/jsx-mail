import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsNumber,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum EmailPriority {
  NORMAL = 'normal',
  HIGH = 'high',
}

export class FromDto {
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @Length(3, 100)
  email: string;
}

export class AttachmentDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  content: string; // base64 content
}

export class SendEmailDto {
  @IsNotEmpty()
  @Length(3, 100)
  subject: string;

  @IsNotEmpty()
  @Length(3, 99999)
  html: string;

  @IsNotEmpty()
  from: FromDto;

  @IsNotEmpty()
  @IsNotEmpty({ each: true })
  @IsArray()
  to: string[];

  @IsOptional()
  @IsString()
  messageId?: string;

  @IsOptional()
  @IsArray()
  attachmentIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsString()
  bulkSendingId?: string;

  @IsOptional()
  @IsObject()
  customPayload?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  delay?: number;

  @IsOptional()
  @IsEnum(EmailPriority)
  priority?: EmailPriority;
}
