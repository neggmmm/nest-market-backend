import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { Order, orderMethods, orderStatus } from '../order/entity/order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymobWebhookDto } from './dto/paymob-webhook.dto';
import { PaymobService } from './paymob.service';
import { DeleteCart } from '../cart/application/use-case/delete-cart.use-case';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymobService: PaymobService,
    private readonly deleteCart: DeleteCart,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPayment(@Req() req, @Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId, userId: req.user.sub },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.method !== orderMethods.ONLINE) {
      throw new Error('Payment session can only be created for online orders');
    }

    const session = await this.paymobService.createPaymentSession({
      amountCents: Math.round(Number(order.totalPrice) * 100),
      items: order.items.map((item) => ({
        name: item.product.name,
        amount_cents: Math.round(Number(item.price) * 100),
        quantity: item.quantity,
      })),
    });

    order.paymobOrderId = session.paymobOrderId;
    await this.orderRepository.save(order);

    return {
      orderId: order.id,
      paymobOrderId: session.paymobOrderId,
      checkoutUrl: session.checkoutUrl,
    };
  }

  @Post('webhook')
  async handleWebhook(@Body() body: PaymobWebhookDto) {
    const isValid = this.paymobService.verifyWebhook(body.obj as Record<string, unknown>, body.hmac);
    if (!isValid) {
      return { received: false, reason: 'invalid-hmac' };
    }

    const paymobOrderId = String(body.obj.order.id);
    const order = await this.orderRepository.findOne({ where: { paymobOrderId } });

    if (!order) {
      return { received: false, reason: 'order-not-found' };
    }

    if (body.obj.success) {
      order.status = orderStatus.ACCEPTED;
      await this.orderRepository.save(order);
      await this.deleteCart.execute(order.userId);
    }

    return { received: true };
  }
}
