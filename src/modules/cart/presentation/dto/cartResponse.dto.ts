import { CartItemDto } from "./cartItem.dto";

export class CartResponseDto {
  // Response DTO: includes computed cart total from the domain model.
  id: number;
  userId: number;
  items: CartItemDto[];
  totalPrice: number;
}
