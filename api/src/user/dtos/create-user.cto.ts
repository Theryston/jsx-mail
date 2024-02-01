import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@Length(3, 100)
	name: string;

	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Length(6, 100)
	password: string;
}