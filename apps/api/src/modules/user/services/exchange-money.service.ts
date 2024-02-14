import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ExchangeMoneyDto } from '../user.dto';

@Injectable()
export class ExchangeMoneyService {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}`,
    });
  }

  async execute({
    amount,
    baseCurrency,
    currency,
  }: ExchangeMoneyDto): Promise<number> {
    const { data } = await this.client.get(
      `/pair/${baseCurrency}/${currency}/${amount}`,
    );

    return data.conversion_result;
  }
}
