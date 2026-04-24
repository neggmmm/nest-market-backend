import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "../../entity/cartItem.entity";
import { Repository } from "typeorm";

@Injectable()
export class CheckItem {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository : Repository<CartItem>
    ){}
    async execute(itemId: number){
        const item = await this.cartItemRepository.findOne({
          where: { id: itemId },
          relations: ['cart']
        })
    
        if (!item) throw new NotFoundException();
    
        return item;

    }
  }