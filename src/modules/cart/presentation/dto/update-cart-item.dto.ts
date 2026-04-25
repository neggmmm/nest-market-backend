import { IsInt, Min } from 'class-validator';

// Request DTO: validates changing quantity for a cart item.
export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
