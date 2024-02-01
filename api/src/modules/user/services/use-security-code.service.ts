import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSessionService } from './create-session.service';
import { UseSecurityCodeDto } from '../user.dto';

@Injectable()
export class UseSecurityCodeService {
	constructor(private readonly prisma: PrismaService, private readonly createSessionService: CreateSessionService) { }

	async execute({ securityCode, permission }: UseSecurityCodeDto) {
		if (permission.startsWith('other') || permission.includes('admin')) {
			throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST)
		}

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

		const session = this.createSessionService.execute({
			permissions: [permission],
			userId: user.id,
			description: 'Session created for use the security code',
			expirationDate: new Date(new Date().getTime() + 1000 * 60 * 5)
		});

		await this.prisma.securityCode.update({
			where: {
				id: code.id
			},
			data: {
				deletedAt: new Date()
			}
		})

		return session
	}
}
