import { IsNotEmpty } from "class-validator";

export class DeleteSessionDto {
	@IsNotEmpty()
	sessionId: string;
}