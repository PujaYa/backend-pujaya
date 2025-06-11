import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import stripeConfig from '../config/stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

constructor(
    @Inject(stripeConfig.KEY)
    private stripeConf: ConfigType<typeof stripeConfig>,
) {
    this.stripe = new Stripe(this.stripeConf.secretKey || '', {
    apiVersion: this.stripeConf.apiVersion as any,
    });
}

async createPaymentIntent(amount: number, currency: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
    amount,
    currency,
    });

return {
    clientSecret: paymentIntent.client_secret,
    };
}
}