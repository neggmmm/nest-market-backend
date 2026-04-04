import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./orderItem.entity";

export enum orderStatus{
    PENDING = "pending",
    ACCEPTED = "accepted",
    DELIVERING = "delivering",
    DELIVERED = "deliverd"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userId: number;

    @Column({type:"enum",enum:orderStatus,default:orderStatus.PENDING})
    status: orderStatus

    @Column()
    totalPrice: number;

    @CreateDateColumn()
    createdAt: Date;
    
    @OneToMany(() => OrderItem, (item)=>item.order,{cascade:true, eager:true})
    items: OrderItem[]
}
