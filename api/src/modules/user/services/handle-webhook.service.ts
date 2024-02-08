import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import Stripe from 'stripe';
import { AddBalanceService } from './add-balance.service';
import { ExchangeMoneyService } from './exchange-money.service';

const SUPPORTED_EVENT_TYPES = ['checkout.session.completed']

@Injectable()
export class HandleWebhookService {
	constructor(private readonly prisma: PrismaService, private readonly addBalanceService: AddBalanceService, private readonly exchangeMoneyService: ExchangeMoneyService) { }

	async execute(event: Stripe.Event) {
		if (!event.type || !SUPPORTED_EVENT_TYPES.includes(event.type)) {
			return {
				message: 'Unsupported event type',
			}
		}

		const object: any = event.data.object

		if (!object) {
			return {
				message: 'Object not found',
			}
		}

		if (object.payment_status !== 'paid') {
			return {
				message: 'Payment not paid',
			}
		}


		const checkout = await this.prisma.checkout.findFirst({
			where: {
				gatewayId: object.id
			}
		})

		if (!checkout) {
			return {
				message: 'Checkout not found',
			}
		}

		const user = await this.prisma.user.findFirst({
			where: {
				id: checkout.userId,
				deletedAt: {
					isSet: false
				}
			}
		})

		if (!user) {
			return {
				message: 'User not found',
			}
		}

		const amount = checkout.amount

		await this.addBalanceService.execute({
			amount,
			description: 'Balance added after payment complete',
			style: 'earn_paid',
			userId: user.id
		})

		await this.prisma.checkout.update({
			where: {
				id: checkout.id
			},
			data: {
				completedAt: new Date()
			}
		})

		return {
			message: 'Success',
		}
	}
}
