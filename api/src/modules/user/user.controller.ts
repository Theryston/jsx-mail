import { Body, Controller, Post, Put, Request } from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import { CreateSecurityCodeDto, CreateUserDto, UseSecurityCodeDto } from './user.cto';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { CreateSecurityCodeService } from './services/create-security-code.service';
import { UseSecurityCodeService } from './services/use-security-code.service';
import { ValidateEmailService } from './services/validate-email.service';

@Controller('user')
export class UserController {
	constructor(private readonly createUserService: CreateUserService, private readonly createSecurityCodeService: CreateSecurityCodeService, private readonly useSecurityCodeService: UseSecurityCodeService, private readonly validateEmailService: ValidateEmailService) { }

	@Post()
	createUser(@Body() data: CreateUserDto) {
		return this.createUserService.execute(data)
	}

	@Post('security-code')
	createSecurityCode(@Body() data: CreateSecurityCodeDto) {
		return this.createSecurityCodeService.execute(data)
	}

	@Post('security-code/use')
	useSecurityCode(@Body() data: UseSecurityCodeDto) {
		return this.useSecurityCodeService.execute(data)
	}

	@Put('validate-email')
	@Permissions([PERMISSIONS.SELF_EMAIL_VALIDATE.value])
	validateEmail(@Request() req) {
		return this.validateEmailService.execute(req.user.id, req.permissions)
	}
}
