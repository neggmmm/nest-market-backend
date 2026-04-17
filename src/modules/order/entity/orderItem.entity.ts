import { ProductOrmEntity } from '../../products/infrastructure/persistence/typeorm/product.orm-entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()

export class OrderItem{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>ProductOrmEntity)
    product: ProductOrmEntity;

    @ManyToOne(()=>Order, (order)=>order.items)
    order:Order;

    @Column()
    quantity:number;

    @Column()
    price:number;
}