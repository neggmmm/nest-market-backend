import { Product } from 'src/modules/products/domain/entities/product';

export class CartItem {
  constructor(
    public readonly id: number,
    public readonly quantity: number,
    public readonly totalPrice: number,
    public readonly product: Product,
  ) {}
}
