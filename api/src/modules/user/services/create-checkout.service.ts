import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { StripeService } from 'src/services/stripe.service';
import { CURRENCY, GATEWAY_SCALE, MINIMUM_ADD_BALANCE, MONEY_SCALE } from 'src/utils/contants';
import { friendlyMoney } from 'src/utils/format-money';
import { User } from '@prisma/client'

@Injectable()
export class CreateCheckoutService {
	constructor(private readonly prisma: PrismaService, private readonly stripeService: StripeService) { }

	async execute(amount: number, userId: string) {
		if (!amount || typeof amount !== 'number') {
			throw new HttpException('Amount is required', HttpStatus.BAD_REQUEST)
		}

		if (!userId || typeof userId !== 'string') {
			throw new HttpException('User id is required', HttpStatus.BAD_REQUEST)
		}

		if (amount < (MINIMUM_ADD_BALANCE / MONEY_SCALE)) {
			throw new HttpException(`Amount must be greater than ${friendlyMoney(MINIMUM_ADD_BALANCE)}`, HttpStatus.BAD_REQUEST)
		}

		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
				deletedAt: {
					isSet: false
				}
			}
		})

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}

		if (!user.gatewayId) {
			user.gatewayId = await this.createGatewayUser(user)
		}

		const session = await this.stripeService.stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: [
				{
					price_data: {
						currency: CURRENCY.toLocaleLowerCase(),
						product_data: {
							name: 'Add Balance'
						},
						unit_amount: amount * GATEWAY_SCALE
					},
					quantity: 1
				}
			],
			customer: user.gatewayId,
			success_url: `${process.env.FRONTEND_URL}/cloud/app/billing`,
		})

		return {
			url: session.url
		}
	}

	private async createGatewayUser(user: User) {
		const customer = await this.stripeService.stripe.customers.create({
			email: user.email,
			name: user.name
		})

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				gatewayId: customer.id
			}
		})

		return customer.id
	}
}
