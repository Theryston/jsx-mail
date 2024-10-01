import { TransactionStyle } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
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
  MaxDate,
  Min,
  MinDate,
} from 'class-validator';
import moment from 'moment';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/, {
    message: 'Please enter a valid full name',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 100)
  password: string;
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

export class ListMessagesDto {
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

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(moment().toDate())
  endDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(moment().subtract(1, 'days').toDate())
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
}
