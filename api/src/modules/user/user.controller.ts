import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import { CreateUserDto, ValidateEmailDto } from './user.cto';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { RequestEmailCodeService } from './services/request-email-code.service';
import { ValidateEmailService } from './services/validate-email.service';

@Controller('user')
export class UserController {
	constructor(private readonly createUserService: CreateUserService, private readonly requestEmailCodeService: RequestEmailCodeService, private readonly validateEmailService: ValidateEmailService) { }

	@Post()
	createUser(@Body() data: CreateUserDto) {
		return this.createUserService.execute(data)
	}

	@Post('request-email-code')
	@Permissions([PERMISSIONS.SELF_REQUEST_EMAIL_CODE.value])
	requestEmailCode(@Request() request) {
		return this.requestEmailCodeService.execute(request.user.id)
	}

	@Post('validate-email')
	@Permissions([PERMISSIONS.SELF_VALIDATE_EMAIL_CODE.value])
	validateEmail(@Body() data: ValidateEmailDto) {
		return this.validateEmailService.execute(data)
	}
}
