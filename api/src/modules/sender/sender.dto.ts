import { IsNotEmpty, Length } from "class-validator";

export class CreateSenderDto {
	@IsNotEmpty()
	@Length(3, 100)
	username: string;

	@IsNotEmpty()
	domainName: string;
}