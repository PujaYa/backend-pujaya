import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('create-intent')
    @ApiBody({ type: CreatePaymentIntentDto })
    createPaymentIntent(
        @Body() body: CreatePaymentIntentDto,
    ) {
        return this.paymentsService.createPaymentIntent(body.amount, body.currency, body.plan, body.userId);
    }

    @Post('create-subscription')
    @ApiBody({ type: CreateSubscriptionDto })
    async createSubscription(
        @Body() body: CreateSubscriptionDto
    ) {
        return await this.paymentsService.createSubscription(body.customerId, body.priceId, body.userId);
    }
}