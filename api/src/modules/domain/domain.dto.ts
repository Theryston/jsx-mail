import { IsNotEmpty, Length } from 'class-validator';

export class CreateDomainDto {
  @IsNotEmpty()
  @Length(3, 255)
  name: string;
}
