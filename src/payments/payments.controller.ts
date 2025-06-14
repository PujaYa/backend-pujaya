import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiBody({ type: CreatePaymentIntentDto })
  createPaymentIntent(@Body() body: CreatePaymentIntentDto) {
    console.log('BODY RECIBIDO EN BACKEND:', body);
    return this.paymentsService.createPaymentIntent(
      body.amount,
      body.currency,
      body.plan,
      body.userId,
    );
  }

  @Post('create-subscription')
  @ApiBody({ type: CreateSubscriptionDto })
  async createSubscription(@Body() body: CreateSubscriptionDto) {
    return await this.paymentsService.createSubscription(
      body.customerId,
      body.priceId,
      body.userId,
    );
  }

  // Webhook endpoint for Stripe
  @Post('webhook')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.handleStripeWebhook(req, res);
  }
}
