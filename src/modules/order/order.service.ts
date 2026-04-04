import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';

@Injectable()
export class OrderService {
    constructor(
        private readonly cartService: CartService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>
    ) { }

    async createOrder(userId: number) {
        const cart = await this.cartService.getCart(userId);
        if (!cart || !cart.items?.length) {
            throw new NotFoundException('Cart not found or empty');
        }
        const products = cart.items.map(item => this.orderItemRepository.create({
            product: item.product,
            quantity: item.quantity,
            price: item.product.price
        }))

        const totalPrice = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.product.price,
            0
        );
        const order = this.orderRepository.create({
            name: `Order for user ${userId}`,
            userId: userId,
            totalPrice,
            items: products,
        });
        const savedOrder = await this.orderRepository.save(order);

        await this.cartService.deleteCart(userId);

        return savedOrder;
    }
}
