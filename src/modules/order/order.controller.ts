import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
    constructor(
        private readonly orderServices : OrderService
    ){}
    @Post("/create")
    confirm(@Req() req){
        return this.orderServices.createOrder(req.user.sub)
    }
}
