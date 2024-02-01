import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import { CreateUserDto } from './dtos/create-user.cto';

@Controller('user')
export class UserController {
	constructor(private readonly createUserService: CreateUserService) { }

	@Post()
	createUser(@Body() data: CreateUserDto) {
		return this.createUserService.execute(data)
	}
}
