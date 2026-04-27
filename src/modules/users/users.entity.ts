import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../cart/infrastructure/typeorm/cart.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: ['superAdmin','admin', 'customer', 'provider','delivery'],
        default: 'customer'
    })
    role: string;

    @Column({ select: false })
    password: string;

    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart;
}
