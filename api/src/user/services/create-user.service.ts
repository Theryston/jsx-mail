import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.cto';

@Injectable()
export class CreateUserService {
	async execute(data: CreateUserDto) {
		return { sim: true }
	}
}
