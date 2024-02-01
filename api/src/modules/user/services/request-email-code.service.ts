import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SendEmailService } from 'src/modules/email/services/send-email.service';

@Injectable()
export class RequestEmailCodeService {
	constructor(private readonly prisma: PrismaService, private readonly sendEmail: SendEmailService) { }

	async execute(userId: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
				deletedAt: {
					isSet: false
				}
			}
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}

		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await this.prisma.securityCode.create({
			data: {
				userId: user.id,
				code,
				expiresAt: new Date(new Date().getTime() + 1000 * 60 * 5) // 5 minutes
			}
		})

		await this.sendEmail.execute({
			from: {
				name: 'JSX Mail Cloud',
				email: `jsxmail@${process.env.DEFAULT_EMAIL_DOMAIN_NAME}`
			},
			to: [user.email],
			subject: 'Your email code',
			html: `<p>Your email code is: <strong>${code}</strong></p>`
		})

		return {
			message: 'Email code sent'
		}
	}
}
