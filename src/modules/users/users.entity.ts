import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../cart/cart.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: ['admin', 'customer', 'saller'],
        default: 'customer'
    })
    role: string;

    @Column({ select: false })
    password: string;

    // A user can have one or more carts; adjust to OneToOne if required by business rules.
    @OneToOne(() => Cart, cart => cart.user)
    carts: Cart;
}