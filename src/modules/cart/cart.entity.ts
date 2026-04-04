import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/users.entity";
import { CartItem } from "./cartItem.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    // Optional numeric FK kept for queries, but prefer object relation for nav.
    @Column()
    userId: number;

    // Relation to user; each user has exactly one cart in this design.
    @OneToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    // Items inside this cart.
    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
    items: CartItem[];
}