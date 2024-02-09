import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
	stripe: Stripe

	constructor() {
		const stripeSecretKey = process.env.STRIPE_SECRET;
		const stripeKey = process.env.STRIPE_KEY;

		if (!stripeSecretKey || !stripeKey) {
			throw new Error('Stripe secret key or stripeKey not found');
		}

		const stripe = new Stripe(stripeSecretKey, {
			typescript: true
		})

		this.stripe = stripe
	}
}
