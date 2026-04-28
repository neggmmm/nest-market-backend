import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../cart/infrastructure/typeorm/cart.entity";
import { ProductOrmEntity } from "../products/infrastructure/persistence/typeorm/product.orm-entity";

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

    @OneToMany(() => ProductOrmEntity, product => product.owner)
    products: ProductOrmEntity[];
}
