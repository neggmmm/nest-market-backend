import { OrderItemDto } from "./orderItem.dto";

export class OrderResponseDto {
  id: number;
  userId: number;
  totalPrice: number;
  createdAt: Date;
  items: OrderItemDto[];
}