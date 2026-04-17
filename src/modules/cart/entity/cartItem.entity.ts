import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { ProductOrmEntity } from '../../products/infrastructure/persistence/typeorm/product.orm-entity';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    // Quantity of this product in the cart
    @Column()
    quantity: number;

    // Cached total for this line item (quantity * product.price).
    @Column()
    totalPrice: number;

    // Association to Product entity. Each cart item belongs to one product.
    @ManyToOne(() => ProductOrmEntity, product => product.cartItems, { eager: true, onDelete: 'RESTRICT' })
    product: ProductOrmEntity;

    // Association to Cart entity. Each cart item belongs to one cart.
    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;
}