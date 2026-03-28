import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cartItem.entity';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) { }

    calculateTotal(cart?: Cart | null) {
        if (!cart?.items?.length) return 0;
        return cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    getCart(userId: number): Promise<Cart | null> {
        return this.cartRepository.findOne({ where: { userId }, relations: ['items', 'items.product'] });
    }

    async addCartItem(productId: number, quantity: number, userId: number) {
        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) throw new NotFoundException();

        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            cart = await this.cartRepository.save({ userId, items: [] });
        }

        let item = cart.items.find(i => i.product.id === productId);

        if (item) {
            item.quantity += quantity;
            item.totalPrice = item.quantity * product.price;
            await this.cartItemRepository.save(item);
        } else {
            item = await this.cartItemRepository.save({
                cart,
                product,
                quantity,
                totalPrice: quantity * product.price,
            });
            cart.items.push(item);
        }

        const total = this.calculateTotal(cart);

        return { cart, total };
    }

    async updateQuantity(itemId: number, quantity: number, userId: number) {
        const item = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart', 'product'],
        });

        if (!item) throw new NotFoundException();

        // 🔥 ensure item belongs to user
        if (item.cart.userId !== userId) {
            throw new ForbiddenException();
        }

        item.quantity = quantity;
        item.totalPrice = quantity * item.product.price;

        await this.cartItemRepository.save(item);

        const cart = await this.getCart(userId);
        const total = this.calculateTotal(cart);

        return { cart, total };
    }

    async removeItem(itemId: number, userId: number) {
        const item = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart'],
        });

        if (!item) throw new NotFoundException();

        if (item.cart.userId !== userId) {
            throw new ForbiddenException();
        }

        await this.cartItemRepository.remove(item);

        const cart = await this.getCart(userId);
        const total = this.calculateTotal(cart);

        return { cart, total };
    }
}
