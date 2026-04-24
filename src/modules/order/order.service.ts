import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';
import { OrderResponseDto } from './dto/orderResponse.dto';
import { orderMethods, orderStatus } from './entity/order.entity';
import { GetCart } from '../cart/application/use-case/get-cart.use-case';
import { DeleteCart } from '../cart/application/use-case/delete-cart.use-case';

@Injectable()
export class OrderService {
  constructor(
    private readonly getCart : GetCart,
    private readonly deleteCart : DeleteCart,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(
    userId: number,
    paymentMethod: string,
  ): Promise<OrderResponseDto | { orderId: number; paymentRequired: boolean }> {
    const cart = await this.getCart.execute(userId);
    if (!cart || !cart.items?.length) {
      throw new NotFoundException('Cart not found or empty');
    }

    const items = cart.items.map((item) =>
      this.orderItemRepository.create({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      }),
    );

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    const order = this.orderRepository.create({
      name: `Order for user ${userId}`,
      userId,
      totalPrice,
      items,
      method: paymentMethod === 'COD' ? orderMethods.COD : orderMethods.ONLINE,
      status: paymentMethod === 'COD' ? orderStatus.ACCEPTED : orderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (paymentMethod === 'COD') {
      await this.deleteCart.execute(userId);
      return this.toOrderResponse(savedOrder);
    }

    return {
      orderId: savedOrder.id,
      paymentRequired: true,
    };
  }

  async getAllOrders(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrder(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    return order;
  }

  private toOrderResponse(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }
}
