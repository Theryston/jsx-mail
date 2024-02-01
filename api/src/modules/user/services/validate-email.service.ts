import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ValidateEmailService {
	constructor(private readonly prisma: PrismaService) { }

	async execute(userId: string, permissions: string[]) {
		if (!permissions.includes(PERMISSIONS.SELF_EMAIL_VALIDATE.value)) {
			throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST)
		}

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				isEmailVerified: true
			}
		})

		return {
			message: 'Email verified successfully'
		}
	}
}
