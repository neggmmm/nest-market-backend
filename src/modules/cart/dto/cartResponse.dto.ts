import { CartItemDto } from "./cartItem.dto";

export class CartResponseDto {
  id: number;
  userId: number;
  items: CartItemDto[];
  totalPrice: number;
}