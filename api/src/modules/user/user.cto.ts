import { IsArray, IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@Length(3, 100)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Length(6, 100)
	password: string;
}

export class CreateSessionDto {
	@IsNotEmpty()
	userId: string;

	@IsArray()
	@IsNotEmpty({ each: true })
	permissions: string[];

	@IsEmpty()
	expirationDate?: Date;
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