import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import { AuthUserDto, CreateSecurityCodeDto, CreateUserDto, ResetPasswordDto, UseSecurityCodeDto } from './user.dto';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { CreateSecurityCodeService } from './services/create-security-code.service';
import { UseSecurityCodeService } from './services/use-security-code.service';
import { ValidateEmailService } from './services/validate-email.service';
import { AuthUserService } from './services/auth-user.service';
import { ResetPasswordService } from './services/reset-password.service';

@Controller('user')
export class UserController {
	constructor(private readonly createUserService: CreateUserService, private readonly createSecurityCodeService: CreateSecurityCodeService, private readonly useSecurityCodeService: UseSecurityCodeService, private readonly validateEmailService: ValidateEmailService, private readonly authUserService: AuthUserService, private readonly resetPasswordService: ResetPasswordService) { }

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

	@Post('auth')
	authUser(@Body() data: AuthUserDto) {
		return this.authUserService.execute(data)
	}

	@Post('reset-password')
	@Permissions([PERMISSIONS.SELF_RESET_PASSWORD.value])
	resetPassword(@Body() data: ResetPasswordDto, @Request() req) {
		return this.resetPasswordService.execute({ ...data, userId: req.user.id, permissions: req.permissions })
	}

	@Get('me')
	@Permissions([PERMISSIONS.SELF_GET.value])
	getMe(@Request() req) {
		return req.user
	}
}
