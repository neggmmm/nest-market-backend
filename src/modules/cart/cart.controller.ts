import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { AddCartItem } from './application/use-case/add-item.use-case';
import { GetCart } from './application/use-case/get-cart.use-case';
import { UpdateQuantity } from './application/use-case/update-quantity.use-case';
import { RemoveItem } from './application/use-case/remove-item.use-case';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(
        private readonly addCartItemUseCase : AddCartItem,
        private readonly getCartUseCase : GetCart,
        private readonly updateQuantityUseCase : UpdateQuantity,
        private readonly removeItemUseCase : RemoveItem,
    ){}

    @Post('add')
    async addCartItem(@Body() body: { productId: number; quantity?: number }, @Req() req) {
        const { productId, quantity = 1 } = body;
        return this.addCartItemUseCase.execute(productId, quantity, req.user.sub);
    }

    @Get()
    async getCart(@Req() req){
        return this.getCartUseCase.execute(req.user.sub);
    }

    @Patch('item/:itemId')
    async updateQuantity(
        @Param('itemId') itemId: string,
        @Body() body: { quantity: number },
        @Req() req,
    ) {
        return this.updateQuantityUseCase.execute(+itemId, body.quantity, req.user.sub);
    }

    @Delete('item/:itemId')
    async removeItem(@Param('itemId') itemId: string, @Req() req) {
        return this.removeItemUseCase.execute(+itemId, req.user.sub);
    }
}
