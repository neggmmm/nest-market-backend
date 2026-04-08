import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(
        private readonly cartService: CartService
    ){}

    @Post('add')
    async addCartItem(@Body() body: { productId: number; quantity?: number }, @Req() req) {
        const { productId, quantity = 1 } = body;
        return this.cartService.addCartItem(productId, quantity, req.user.sub);
    }

    @Get()
    async getCart(@Req() req){
        return this.cartService.getCart(req.user.sub);
    }

    @Patch('item/:itemId')
    async updateQuantity(
        @Param('itemId') itemId: string,
        @Body() body: { quantity: number },
        @Req() req,
    ) {
        return this.cartService.updateQuantity(+itemId, body.quantity, req.user.sub);
    }

    @Delete('item/:itemId')
    async removeItem(@Param('itemId') itemId: string, @Req() req) {
        return this.cartService.removeItem(+itemId, req.user.sub);
    }
}
