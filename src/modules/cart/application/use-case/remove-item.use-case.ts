import { ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "../../entity/cartItem.entity";
import { Repository } from "typeorm";
import { CheckItem } from "./check-item.use-case";
import { GetCart } from "./get-cart.use-case";
import { CalculateTotal } from "./calculate-total-use-case";

export class RemoveItem {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository : Repository<CartItem>,
        private readonly checkItem : CheckItem,
        private readonly getCart : GetCart,
        private readonly calculateTotal : CalculateTotal,
    ){}
    async execute (itemId: number, userId: number){

        const item = await this.checkItem.execute(itemId)
    
        if (item.cart.userId !== userId) {
          throw new ForbiddenException();
        }
    
        await this.cartItemRepository.remove(item);
    
        const cart = await this.getCart.execute(userId);
        const total = this.calculateTotal.execute(cart);
    
        return { cart, total };
    }
  }