import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
    constructor(
        private readonly orderServices : OrderService
    ){}
    @Post("/create")
    create(@Req() req){
        return this.orderServices.createOrder(req.user.sub)
    }

    @Get()
    getAllOrders(@Req() req){
        return this.orderServices.getAllOrders(req.user.sub)
    }

    @Get(":id")
    getOrder(@Req() req, @Param('id', ParseIntPipe) orderId: number,){
        return this.orderServices.getOrder(req.user.sub, orderId )
    }
}
