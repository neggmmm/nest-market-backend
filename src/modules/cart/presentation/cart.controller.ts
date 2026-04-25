import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/presentation/http/guard/auth.guard';
import { AddCartItem } from '../application/use-case/add-item.use-case';
import { DeleteCart } from '../application/use-case/delete-cart.use-case';
import { GetCart } from '../application/use-case/get-cart.use-case';
import { RemoveItem } from '../application/use-case/remove-item.use-case';
import { UpdateQuantity } from '../application/use-case/update-quantity.use-case';
import { Cart } from '../domain/entities/cart';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartResponseDto } from './dto/cartResponse.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(
    private readonly addCartItemUseCase: AddCartItem,
    private readonly getCartUseCase: GetCart,
    private readonly updateQuantityUseCase: UpdateQuantity,
    private readonly removeItemUseCase: RemoveItem,
    private readonly deleteCartUseCase: DeleteCart,
  ) {}

  // HTTP endpoint: add a product, defaulting quantity to one.
  @Post('add')
  async addCartItem(@Body() dto: AddCartItemDto, @Req() req): Promise<CartResponseDto> {
    const cart = await this.addCartItemUseCase.execute(dto.productId, dto.quantity ?? 1, req.user.sub);
    return this.toResponse(cart);
  }

  // HTTP endpoint: read the authenticated user's cart.
  @Get()
  async getCart(@Req() req): Promise<CartResponseDto | null> {
    const cart = await this.getCartUseCase.execute(req.user.sub);
    return cart ? this.toResponse(cart) : null;
  }

  // HTTP endpoint: update quantity for one owned cart item.
  @Patch('item/:itemId')
  async updateQuantity(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
    @Req() req,
  ): Promise<CartResponseDto> {
    const cart = await this.updateQuantityUseCase.execute(itemId, dto.quantity, req.user.sub);
    return this.toResponse(cart);
  }

  // HTTP endpoint: remove one owned cart item.
  @Delete('item/:itemId')
  async removeItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Req() req,
  ): Promise<CartResponseDto | null> {
    const cart = await this.removeItemUseCase.execute(itemId, req.user.sub);
    return cart ? this.toResponse(cart) : null;
  }

  // HTTP endpoint: clear the authenticated user's whole cart.
  @Delete()
  async deleteCart(@Req() req): Promise<void> {
    return this.deleteCartUseCase.execute(req.user.sub);
  }

  // Mapper: keeps presentation response shape outside the application layer.
  private toResponse(cart: Cart): CartResponseDto {
    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
      })),
      totalPrice: cart.totalPrice,
    };
  }
}
