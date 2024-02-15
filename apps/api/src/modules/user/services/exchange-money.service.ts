import { Injectable } from '@nestjs/common';
import { ExchangeMoneyDto } from '../user.dto';

@Injectable()
export class ExchangeMoneyService {
  async execute({
    amount,
    baseCurrency,
    currency,
  }: ExchangeMoneyDto): Promise<number> {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${baseCurrency}/${currency}/${amount}`,
    );

    const data = await response.json();

    return data.conversion_result;
  }
}
