import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET;
    if (!stripeSecretKey) throw new Error('Stripe secret key not found');

    const stripe = new Stripe(stripeSecretKey, {
      typescript: true,
    });

    this.stripe = stripe;
  }
}
