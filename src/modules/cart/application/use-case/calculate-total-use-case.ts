import { Injectable } from "@nestjs/common";
import { Cart } from "../../entity/cart.entity";

@Injectable()

export class CalculateTotal {
    execute(cart?: Cart | null){
        if (!cart?.items?.length) return 0;
        return cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }
  }