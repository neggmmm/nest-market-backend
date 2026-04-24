import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../../entity/cart.entity";
import { Repository } from "typeorm";

@Injectable()

export class DeleteCart {
    constructor(
        @InjectRepository(Cart)
        private cartRepository : Repository<Cart>
    ){}
    async execute (userId: number): Promise<void>{
        await this.cartRepository.delete({ userId });
    }
  }