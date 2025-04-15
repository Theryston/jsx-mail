import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VerifyTurnstileService {
  constructor() {}

  async execute(token: string) {
    try {
      const { data: response } = await axios.post(
        `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
        { secret: process.env.TURNSTILE_SECRET_KEY, response: token },
      );

      if (!response.success) {
        throw new BadRequestException('Invalid turnstile token');
      }
    } catch (error) {
      console.error('Error verifying turnstile token', error.response.data);
      throw new BadRequestException('Error verifying turnstile token');
    }
  }
}
