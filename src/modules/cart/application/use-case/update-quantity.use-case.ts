import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "../../entity/cartItem.entity";
import { Repository } from "typeorm";
import { CalculateTotal } from "./calculate-total-use-case";
import { CheckItem } from "./check-item.use-case";
import { GetCart } from "./get-cart.use-case";

@Injectable()

export class UpdateQuantity {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository : Repository<CartItem>,
        private readonly calculateTotal : CalculateTotal,
        private readonly checkItem : CheckItem,
        private readonly getCart : GetCart
    ){}
    async execute(itemId: number, quantity: number, userId: number){
        const item = await this.checkItem.execute(itemId)
    
        if (item.cart.userId !== userId) {
          throw new ForbiddenException();
        }
    
        item.quantity = quantity;
        item.totalPrice = quantity * item.product.price;
    
        await this.cartItemRepository.save(item);
    
        const cart = await this.getCart.execute(userId);
        const total = this.calculateTotal.execute(cart);
    
        return { cart, total };
    }
  }
