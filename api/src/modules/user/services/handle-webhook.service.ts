import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { MONEY_SCALE, GATEWAY_SCALE } from 'src/utils/contants';
import Stripe from 'stripe';
import { AddBalanceService } from './add-balance.service';

const SUPPORTED_EVENT_TYPES = ['checkout.session.completed']

@Injectable()
export class HandleWebhookService {
	constructor(private readonly prisma: PrismaService, private readonly addBalanceService: AddBalanceService) { }

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

		const user = await this.prisma.user.findFirst({
			where: {
				gatewayId: object.customer,
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

		const amount = Math.round(object.amount_total * (
			MONEY_SCALE / GATEWAY_SCALE
		))

		await this.addBalanceService.execute({
			amount,
			description: 'Balance added after payment complete',
			style: 'earn_paid',
			userId: user.id
		})

		return {
			message: 'Success',
		}
	}
}
