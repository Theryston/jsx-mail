import { IsArray, IsNotEmpty, Length } from 'class-validator';

export class FromDto {
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @Length(3, 100)
  email: string;
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
}
