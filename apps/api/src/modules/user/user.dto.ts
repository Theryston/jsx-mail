import {
  MessageStatus,
  OnboardingStep,
  TransactionStyle,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
  IsBoolean,
  IsArray,
  IsEnum,
} from 'class-validator';
import { WebhookDto } from '../sender/sender.dto';

export class CreateUserWebhookDto extends WebhookDto {}

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 200)
  password: string;

  @IsNotEmpty()
  turnstileToken: string;

  @IsOptional()
  @IsString()
  utmGroupId?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  leadId?: string;
}

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}

export class CheckEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UseSecurityCodeDto {
  @IsNotEmpty()
  @Length(6, 6)
  securityCode: string;

  @IsNotEmpty()
  permission: string;
}

export class CreateSecurityCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class AuthUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @Length(6, 100)
  newPassword: string;
}

export class AddBalanceDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  style: TransactionStyle;

  @IsNotEmpty()
  description: string;
}

export class CreateCheckoutDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  country: string;
}

export class ExchangeMoneyDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  baseCurrency: string;

  @IsNotEmpty()
  currency: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/, {
    message: 'Please enter a valid full name',
  })
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsDate()
  birthdate?: Date;
}

export class MessagesInsightsDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsEmail()
  fromEmail?: string;

  @IsOptional()
  @IsEmail()
  toEmail?: string;

  @IsOptional()
  @IsString()
  statuses?: string;

  @IsOptional()
  @IsString()
  bulkSending?: string;
}

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
}

export class ExportMessagesDto extends MessagesInsightsDto {
  @IsNotEmpty()
  @IsEnum(ExportFormat)
  format: ExportFormat;
}

export class ListMessagesDto extends MessagesInsightsDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeStatusHistory?: boolean;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  take: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;
}

export class UpdateOnboardingDto {
  @IsNotEmpty()
  @IsString()
  onboardingStep: OnboardingStep;
}

export class GetUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  take?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;
}

export class ImpersonateUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class InsightsItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class BlockPermissionDto {
  @IsNotEmpty()
  @IsString()
  permission: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateDefaultSettingsDto {
  @IsNotEmpty()
  @IsNumber()
  maxFileSize: number;

  @IsNotEmpty()
  @IsNumber()
  maxBalanceToBeEligibleForFree: number;

  @IsNotEmpty()
  @IsNumber()
  freeEmailsPerMonth: number;

  @IsNotEmpty()
  @IsNumber()
  minBalanceToAdd: number;

  @IsNotEmpty()
  @IsNumber()
  storageGbPrice: number;

  @IsNotEmpty()
  @IsNumber()
  pricePerMessage: number;

  @IsNotEmpty()
  @IsNumber()
  maxStorage: number;

  @IsNotEmpty()
  @IsNumber()
  globalMaxMessagesPerSecond: number;

  @IsNotEmpty()
  @IsNumber()
  globalMaxMessagesPerDay: number;

  @IsNotEmpty()
  @IsNumber()
  bounceRateLimit: number;

  @IsNotEmpty()
  @IsNumber()
  complaintRateLimit: number;

  @IsNotEmpty()
  @IsNumber()
  gapToCheckSecurityInsights: number;

  @IsNotEmpty()
  @IsNumber()
  minEmailsForRateCalculation: number;

  @IsNotEmpty()
  @IsNumber()
  maxSecurityCodesPerHour: number;

  @IsNotEmpty()
  @IsNumber()
  maxSecurityCodesPerMinute: number;

  @IsNotEmpty()
  @IsNumber()
  globalEmailsCheckPerSecond: number;

  @IsNotEmpty()
  @IsNumber()
  globalBulkEmailCheckMaxBatchSize: number;

  @IsNotEmpty()
  @IsNumber()
  pricePerEmailCheck: number;
}

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsNumber()
  maxFileSize?: number;

  @IsOptional()
  @IsNumber()
  maxBalanceToBeEligibleForFree?: number;

  @IsOptional()
  @IsNumber()
  freeEmailsPerMonth?: number;

  @IsOptional()
  @IsNumber()
  minBalanceToAdd?: number;

  @IsOptional()
  @IsNumber()
  storageGbPrice?: number;

  @IsOptional()
  @IsNumber()
  pricePerMessage?: number;

  @IsOptional()
  @IsNumber()
  maxStorage?: number;

  @IsOptional()
  @IsNumber()
  bounceRateLimit?: number;

  @IsOptional()
  @IsNumber()
  complaintRateLimit?: number;

  @IsOptional()
  @IsNumber()
  gapToCheckSecurityInsights?: number;

  @IsOptional()
  @IsNumber()
  minEmailsForRateCalculation?: number;

  @IsOptional()
  @IsNumber()
  maxSecurityCodesPerHour?: number;

  @IsOptional()
  @IsNumber()
  maxSecurityCodesPerMinute?: number;

  @IsOptional()
  @IsNumber()
  pricePerEmailCheck?: number;
}

export class CreateOneUtmDto {
  @IsNotEmpty()
  @IsString()
  utmName: string;

  @IsNotEmpty()
  @IsString()
  utmValue: string;
}

export class CreateUtmDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  userUtmGroupId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOneUtmDto)
  utms?: CreateOneUtmDto[];
}

export class ForceSendMessageWebhookDto {
  @IsNotEmpty()
  @IsEnum(MessageStatus)
  status: MessageStatus;
}
