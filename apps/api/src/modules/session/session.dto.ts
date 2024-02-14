import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class DeleteSessionDto {
  @IsNotEmpty()
  sessionId: string;
}

export class CreateSessionDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  permissions: string[];

  @IsNotEmpty()
  description: string;

  @IsOptional()
  expirationDate?: Date;
}
