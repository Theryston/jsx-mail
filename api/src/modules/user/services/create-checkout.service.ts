import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { StripeService } from 'src/services/stripe.service';
import {
  CURRENCY,
  GATEWAY_SCALE,
  MINIMUM_ADD_BALANCE,
  MONEY_SCALE,
} from 'src/utils/contants';
import { friendlyMoney } from 'src/utils/format-money';
import { User } from '@prisma/client';
import { CreateCheckoutDto } from '../user.dto';
import countryToCurrency from 'country-to-currency';
import { ExchangeMoneyService } from './exchange-money.service';

@Injectable()
export class CreateCheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly exchangeMoneyService: ExchangeMoneyService,
  ) {}

  async execute({ amount, country }: CreateCheckoutDto, userId: string) {
    if (!amount || typeof amount !== 'number') {
      throw new HttpException('Amount is required', HttpStatus.BAD_REQUEST);
    }

    if (!userId || typeof userId !== 'string') {
      throw new HttpException('User id is required', HttpStatus.BAD_REQUEST);
    }

    const currency = countryToCurrency[country];

    if (!currency) {
      throw new HttpException('Invalid country', HttpStatus.BAD_REQUEST);
    }

    const amountScale = Math.round(amount * MONEY_SCALE);

    amount = await this.exchangeMoneyService.execute({
      amount: amount,
      baseCurrency: CURRENCY,
      currency,
    });
    amount = Math.round(amount * GATEWAY_SCALE);

    if (amount < MINIMUM_ADD_BALANCE / MONEY_SCALE) {
      throw new HttpException(
        `Amount must be greater than ${friendlyMoney(MINIMUM_ADD_BALANCE)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: {
          isSet: false,
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.gatewayId) {
      user.gatewayId = await this.createGatewayUser(user);
    }

    const session = await this.stripeService.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Add Balance',
              description: `Add ${friendlyMoney(amountScale)} to your JSX Mail account`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer: user.gatewayId,
      success_url: `${process.env.FRONTEND_URL}/cloud/app/billing`,
    });

    await this.prisma.checkout.create({
      data: {
        gatewayId: session.id,
        gatewayUrl: session.url,
        localAmount: amount,
        amount: amountScale,
        userId: user.id,
        localCurrency: currency,
      },
    });

    return {
      url: session.url,
    };
  }

  private async createGatewayUser(user: User) {
    const customer = await this.stripeService.stripe.customers.create({
      email: user.email,
      name: user.name,
    });

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        gatewayId: customer.id,
      },
    });

    return customer.id;
  }
}
