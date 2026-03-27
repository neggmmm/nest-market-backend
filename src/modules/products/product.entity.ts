import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "../cart/cartItem.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    image: string;

    // Inverse relation: which cart items reference this product.
    @OneToMany(() => CartItem, cartItem => cartItem.product)
    cartItems: CartItem[];
}