import { Injectable, Inject, Res, Req, BadRequestException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import stripeConfig from '../config/stripe';
import { UsersService } from '../users/users.service';
import { Response, Request } from 'express';
import { UserRole } from '../users/types/roles';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        @Inject(stripeConfig.KEY)
        private stripeConf: ConfigType<typeof stripeConfig>,
        private readonly usersService: UsersService,
    ) {
        this.stripe = new Stripe(this.stripeConf.secretKey || '', {
            apiVersion: this.stripeConf.apiVersion as any,
        });
    }

    async createPaymentIntent(amount: number, currency: string, plan: 'monthly' | 'annual', userId?: string) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                plan,
                userId: userId || '',
            },
        });
        return {
            clientSecret: paymentIntent.client_secret,
        };
    }

    async handleStripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(
                req.body,
                sig as string,
                process.env.STRIPE_WEBHOOK_SECRET || ''
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        }
        // Procesar evento de pago exitoso
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const userId = paymentIntent.metadata.userId;
            const plan = paymentIntent.metadata.plan;
            if (userId && plan) {
                // Actualizar usuario a premium
                await this.usersService.update(userId, {
                    role: UserRole.PREMIUM
                });
            }
        }
        res.json({ received: true });
    }

    async createSubscription(customerId: string, priceId: string, userId: string) {
        // Crear la suscripción
        const subscription = await this.stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });

        const paymentIntent = (subscription.latest_invoice as any)?.payment_intent;
        // Guardar datos de la suscripción en el usuario
        await this.usersService.update(userId, {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionEndDate: (subscription as any).current_period_end
                ? new Date((subscription as any).current_period_end * 1000)
                : undefined,
        });

        return {
            clientSecret: paymentIntent?.client_secret,
        };
    }
}
