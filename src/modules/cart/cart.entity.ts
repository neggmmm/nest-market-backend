import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/users.entity";
import { CartItem } from "./cartItem.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    // Optional numeric FK kept for queries, but prefer object relation for nav.
    @Column()
    userId: number;

    // Relation to user; one user can own multiple carts (or one cart in your design).
    @ManyToOne(() => User, user => user.carts, { onDelete: 'CASCADE' })
    user: User;

    // Items inside this cart.
    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
    items: CartItem[];
}