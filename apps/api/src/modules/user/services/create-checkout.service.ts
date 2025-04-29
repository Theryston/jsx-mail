import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { StripeService } from 'src/services/stripe.service';
import { GATEWAY_SCALE, MONEY_SCALE, CURRENCY } from 'src/utils/constants';
import { friendlyMoney } from 'src/utils/format-money';
import { User } from '@prisma/client';
import { CreateCheckoutDto } from '../user.dto';
import countryToCurrency from 'country-to-currency';
import { ExchangeMoneyService } from './exchange-money.service';
import { GetSettingsService } from './get-settings.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateCheckoutService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly stripeService: StripeService,
    private readonly exchangeMoneyService: ExchangeMoneyService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute(
    { amount: originalAmount, country }: CreateCheckoutDto,
    userId: string,
  ) {
    let amount = originalAmount;

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

    const settings = await this.getSettingsService.execute();

    amount = await this.exchangeMoneyService.execute({
      amount: amount,
      baseCurrency: CURRENCY,
      currency,
    });
    amount = Math.round(amount * GATEWAY_SCALE);

    if (amount < settings.minBalanceToAdd / MONEY_SCALE) {
      throw new HttpException(
        `Amount must be greater than ${friendlyMoney(settings.minBalanceToAdd, false)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
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
              description: `Add ${friendlyMoney(amountScale, false)} to your JSX Mail account`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer: user.gatewayId,
      success_url: `${process.env.CLOUD_FRONTEND_URL}/billing?success=true&amount=${originalAmount}`,
      cancel_url: `${process.env.CLOUD_FRONTEND_URL}/billing`,
    });

    await this.prisma.client.checkout.create({
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

    await this.prisma.client.user.update({
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
