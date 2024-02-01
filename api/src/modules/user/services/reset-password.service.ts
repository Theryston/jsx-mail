import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ResetPasswordDto } from '../user.dto';
import { PERMISSIONS } from 'src/auth/permissions';
import * as bcrypt from 'bcrypt';

type ResetPassword = {
	userId: string;
	permissions: string[];
} & ResetPasswordDto;

@Injectable()
export class ResetPasswordService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ newPassword, userId, permissions }: ResetPassword) {
		if (!permissions.includes(PERMISSIONS.SELF_RESET_PASSWORD.value)) {
			throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST)
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(newPassword, salt);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				password: hashPassword
			}
		})

		return {
			message: 'Password reset successfully'
		}
	}
}
