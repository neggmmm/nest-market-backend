import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entity/cartItem.entity';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { ProductOrmEntity } from '../products/infrastructure/persistence/typeorm/product.orm-entity';
import { CartResponseDto } from './dto/cartResponse.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductOrmEntity)
    private productRepository: Repository<ProductOrmEntity>,
  ) { }

  calculateTotal(cart?: Cart | null) {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getCart(userId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

async addCartItem(productId: number,quantity: number,userId: number): Promise<CartResponseDto> {
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

  const totalPrice = this.calculateTotal(updatedCart);

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
  async updateQuantity(itemId: number, quantity: number, userId: number) {
    const item = await this.checkItem(itemId)

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

  async deleteCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ userId });
  }
  async removeItem(itemId: number, userId: number) {
    const item = await this.checkItem(itemId)

    if (item.cart.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.cartItemRepository.remove(item);

    const cart = await this.getCart(userId);
    const total = this.calculateTotal(cart);

    return { cart, total };
  }

  async checkItem(itemId: number) {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId },
      relations: ['cart']
    })

    if (!item) throw new NotFoundException();

    return item;
  }
}
