import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';
import { OrderResponseDto } from './dto/orderResponse.dto';

@Injectable()
export class OrderService {
    constructor(
        private readonly cartService: CartService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>
    ) { }

    async createOrder(userId: number): Promise<OrderResponseDto> {
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

        return {
            id: savedOrder.id,
            userId: savedOrder.userId,
            totalPrice: savedOrder.totalPrice,
            createdAt: savedOrder.createdAt,
            items: savedOrder.items.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
        };
    }

    async getAllOrders(userId: number) {
        return this.orderRepository.find({ where: { userId }, relations: ['items', "items.product"], order: { createdAt: 'DESC' } })
    }

    async getOrder(userId: number, orderId: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId, userId }, relations: ['items', 'items.product'] })

        if (!order) {
            throw new NotFoundException('Order Not Found')
        }
        return order;
    }

}
