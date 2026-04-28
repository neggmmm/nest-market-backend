import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/modules/products/domain/entities/product';
import { ProductOrmEntity } from 'src/modules/products/infrastructure/persistence/typeorm/product.orm-entity';
import { Cart as DomainCart } from '../../domain/entities/cart';
import { CartItem as DomainCartItem } from '../../domain/entities/cartItems';
import {
  AddCartItemRepositoryData,
  CartRepository,
  RemoveCartItemRepositoryData,
  UpdateCartItemQuantityRepositoryData,
} from '../../domain/repositories/cart.repository';
import { Cart } from './cart.entity';
import { CartItem } from './cartItem.entity';

@Injectable()
export class TypeormCartRepository implements CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>,
  ) {}

  // Adapter query: returns the current cart state as a domain entity.
  async findByUserId(userId: number): Promise<DomainCart | null> {
    const cart = await this.findOrmCartByUserId(userId);
    return cart ? this.toDomain(cart) : null;
  }

  // Adapter command: creates the cart when needed and adds/merges the item.
  async addItem(data: AddCartItemRepositoryData): Promise<DomainCart | null> {
    const product = await this.productRepository.findOneBy({ id: data.productId });
    if (!product) return null;

    const cart = await this.getOrCreateCart(data.userId);
    let item = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: data.productId },
      },
      relations: ['cart', 'product'],
    });

    const productPrice = Number(product.price);
    if (item) {
      item.quantity += data.quantity;
      item.totalPrice = item.quantity * productPrice;
    } else {
      item = this.cartItemRepository.create({
        cart,
        product,
        quantity: data.quantity,
        totalPrice: data.quantity * productPrice,
      });
    }

    await this.cartItemRepository.save(item);
    return this.findByUserId(data.userId);
  }

  // Adapter command: only updates an item when it belongs to the current user.
  async updateItemQuantity(data: UpdateCartItemQuantityRepositoryData): Promise<DomainCart | null> {
    const item = await this.findOwnedItem(data.userId, data.itemId);
    if (!item) return null;

    item.quantity = data.quantity;
    item.totalPrice = data.quantity * Number(item.product.price);

    await this.cartItemRepository.save(item);
    return this.findByUserId(data.userId);
  }

  // Adapter command: only removes an item when it belongs to the current user.
  async removeItem(data: RemoveCartItemRepositoryData): Promise<DomainCart | null> {
    const item = await this.findOwnedItem(data.userId, data.itemId);
    if (!item) return null;

    await this.cartItemRepository.remove(item);
    return this.findByUserId(data.userId);
  }

  // Adapter command: deletes the whole cart for the authenticated user.
  async deleteByUserId(userId: number): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  // ORM helper: centralizes cart relation loading for consistent mapping.
  private findOrmCartByUserId(userId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

  // ORM helper: creates one cart per user on demand.
  private async getOrCreateCart(userId: number): Promise<Cart> {
    const existingCart = await this.cartRepository.findOne({ where: { userId } });
    if (existingCart) return existingCart;

    return this.cartRepository.save(this.cartRepository.create({ userId }));
  }

  // ORM helper: prevents changing another user's cart item.
  private findOwnedItem(userId: number, itemId: number): Promise<CartItem | null> {
    return this.cartItemRepository.findOne({
      where: {
        id: itemId,
        cart: { userId },
      },
      relations: ['cart', 'product'],
    });
  }

  // Mapper: converts TypeORM entities into cart domain objects.
  private toDomain(cart: Cart): DomainCart {
    return new DomainCart(
      cart.id,
      cart.userId,
      (cart.items ?? []).map((item) => this.toDomainItem(item)),
    );
  }

  // Mapper: converts TypeORM cart item rows into domain items.
  private toDomainItem(item: CartItem): DomainCartItem {
    return new DomainCartItem(
      item.id,
      item.quantity,
      Number(item.totalPrice),
      new Product(
        item.product.id,
        item.product.name,
        Number(item.product.price),
        item.product.userId,
        item.product.image,
      ),
    );
  }
}
