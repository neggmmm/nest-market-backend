import { Product } from "src/modules/products/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()

export class OrderItem{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Product)
    product: Product;

    @ManyToOne(()=>Order, (order)=>order.items)
    order:Order;

    @Column()
    quantity:number;

    @Column()
    price:number;
}