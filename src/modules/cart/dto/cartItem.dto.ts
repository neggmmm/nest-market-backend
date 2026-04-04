export class CartItemDto {
  id?: number;
  quantity?: number;
  totalPrice?: number;
  product?: {
    id: number;
    name: string;
    price: number;
  };
}