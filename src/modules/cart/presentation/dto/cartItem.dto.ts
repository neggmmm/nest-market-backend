export class CartItemDto {
  // Response DTO: exposes only the cart item fields needed by the client.
  id?: number;
  quantity?: number;
  totalPrice?: number;
  product?: {
    id: number;
    name: string;
    price: number;
  };
}
