import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ValidateEmailDto } from '../user.cto';

@Injectable()
export class ValidateEmailService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ securityCode }: ValidateEmailDto) {
		const code = await this.prisma.securityCode.findFirst({
			where: {
				code: securityCode,
				deletedAt: {
					isSet: false
				}
			}
		});

		if (!code) {
			throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST)
		}

		if (code.expiresAt < new Date()) {
			throw new HttpException('Code expired', HttpStatus.BAD_REQUEST)
		}

		const user = await this.prisma.user.findFirst({
			where: {
				id: code.userId,
				deletedAt: {
					isSet: false
				}
			}
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}

		await this.prisma.securityCode.update({
			where: {
				id: code.id
			},
			data: {
				deletedAt: new Date()
			}
		})

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				isEmailVerified: true
			}
		})

		return {
			message: 'Email verified'
		}
	}
}
