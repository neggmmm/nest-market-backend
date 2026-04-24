import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderServices: OrderService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() body: { paymentMethod: string }) {
    return this.orderServices.createOrder(req.user.sub, body.paymentMethod);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllOrders(@Req() req) {
    return this.orderServices.getAllOrders(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOrder(@Req() req, @Param('id', ParseIntPipe) orderId: number) {
    return this.orderServices.getOrder(req.user.sub, orderId);
  }
}
