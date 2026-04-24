import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cart } from "../../entity/cart.entity";

@Injectable()

export class GetCart{
    constructor(
        @InjectRepository(Cart)
        private cartRepository : Repository<Cart>
    ){}
    execute(userId: number): Promise<Cart | null> {
        return this.cartRepository.findOne({
          where: { userId },
          relations: ['items', 'items.product'],
        });
    }
  }