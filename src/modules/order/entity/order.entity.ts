import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./orderItem.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userId: number;

    @Column()
    totalPrice: number;

    @OneToMany(() => OrderItem, (item)=>item.order,{cascade:true, eager:true})
    items: OrderItem[]
}
