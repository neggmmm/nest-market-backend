import { IsInt, IsOptional, Min } from 'class-validator';

// Request DTO: validates adding a product to the cart.
export class AddCartItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
