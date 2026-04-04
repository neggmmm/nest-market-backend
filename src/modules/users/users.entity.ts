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

    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart;
}