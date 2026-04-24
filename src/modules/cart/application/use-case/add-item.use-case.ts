import { Injectable, NotFoundException } from "@nestjs/common";
import { CartResponseDto } from "../../dto/cartResponse.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "../../entity/cartItem.entity";
import { Repository } from "typeorm";
import { Cart } from "../../entity/cart.entity";
import { ProductOrmEntity } from "src/modules/products/infrastructure/persistence/typeorm/product.orm-entity";
import { CalculateTotal } from "./calculate-total-use-case";

@Injectable()

export class AddCartItem {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(ProductOrmEntity)
        private productRepository: Repository<ProductOrmEntity>,
        private readonly calculateTotal : CalculateTotal
    ) { }
    async execute(productId: number, quantity: number, userId: number): Promise<CartResponseDto> {
        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) throw new NotFoundException('Product not found');

        const price = Number(product.price); // ensure number
        let cart = await this.cartRepository.findOne({
            where: { userId },
        });

        if (!cart) {
            cart = await this.cartRepository.save({ userId });
        }
        let item = await this.cartItemRepository.findOne({
            where: {
                cart: { id: cart.id },
                product: { id: productId },
            },
            relations: ['product', 'cart'],
        });

        if (item) {
            item.quantity += quantity;
            item.totalPrice = item.quantity * price;
        } else {
            item = this.cartItemRepository.create({
                cart,
                product,
                quantity,
                totalPrice: quantity * price,
            });
        }
        await this.cartItemRepository.save(item);
        const updatedCart = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['items', 'items.product'],
        });

        const totalPrice = this.calculateTotal.execute(updatedCart);

        return {
            id: updatedCart!.id,
            userId: updatedCart!.userId,
            items: updatedCart!.items.map((i) => ({
                id: i.id,
                quantity: i.quantity,
                totalPrice: i.totalPrice,
                product: i.product,
            })),
            totalPrice,
        };
    }

}