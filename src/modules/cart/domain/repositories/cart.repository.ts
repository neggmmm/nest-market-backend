import { Cart } from '../entities/cart';

export const CART_REPOSITORY = Symbol('CART_REPOSITORY');

export interface CartRepository {
  findByUserId(userId: number): Promise<Cart | null>;
  addItem(data: AddCartItemRepositoryData): Promise<Cart | null>;
  updateItemQuantity(data: UpdateCartItemQuantityRepositoryData): Promise<Cart | null>;
  removeItem(data: RemoveCartItemRepositoryData): Promise<Cart | null>;
  deleteByUserId(userId: number): Promise<void>;
}

export interface AddCartItemRepositoryData {
  userId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartItemQuantityRepositoryData {
  userId: number;
  itemId: number;
  quantity: number;
}

export interface RemoveCartItemRepositoryData {
  userId: number;
  itemId: number;
}
