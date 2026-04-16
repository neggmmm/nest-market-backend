import { SelectQueryBuilder } from "typeorm";
import { ProductOrmEntity } from "../product.orm-entity";

export class PriceSpecifictaion {
    constructor(private min?: number, private max?: number){}

    apply(qb: SelectQueryBuilder<ProductOrmEntity>){
        if(this.min !== undefined){
            qb.andWhere(`product.price >= :min`,{min: this.min});
        }
        if(this.max !== undefined){
            qb.andWhere(`product.price <= :max`,{max: this.max});
        }
        
    }
}