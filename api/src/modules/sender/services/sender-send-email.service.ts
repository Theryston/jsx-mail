import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { PrismaService } from 'src/services/prisma.service';
import { SenderSendEmailDto } from '../sender.dto';
import { PRICE_PER_MESSAGE } from 'src/utils/contants';
import { messageSelect } from 'src/utils/public-selects';
import moment from 'moment';

@Injectable()
export class SenderSendEmailService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly getBalanceService: GetBalanceService,
		private readonly sendEmailService: SendEmailService
	) { }

	async execute({ sender: senderEmail, html, subject, to }: SenderSendEmailDto, userId: string) {
		const todayDay = moment().format('YYYY-MM-DD');

		const sender = await this.prisma.sender.findFirst({
			where: {
				email: senderEmail,
				userId,
				deletedAt: {
					isSet: false
				}
			}
		});

		if (!sender) {
			throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
		}

		const balance = await this.getBalanceService.execute(userId);

		if (balance.amount < PRICE_PER_MESSAGE) {
			throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
		}

		let message = await this.prisma.message.create({
			data: {
				body: html,
				subject,
				to,
				domainId: sender.domainId,
				senderId: sender.id,
				userId,
			},
			select: messageSelect
		})

		await this.sendEmailService.execute({
			from: {
				name: sender.name,
				email: sender.email
			},
			html,
			subject,
			to
		})

		message = await this.prisma.message.update({
			where: {
				id: message.id
			},
			data: {
				sentAt: new Date(),
				sentDay: todayDay,
				status: 'sent'
			},
			select: messageSelect
		})

		return message
	}
}
