import { TransactionStyle } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';

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
