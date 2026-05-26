import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../users/users.entity";
import { Product } from "../products/domain/entities/product";
import { ProductOrmEntity } from "../products/infrastructure/persistence/typeorm/product.orm-entity";


@Entity('review')
@Unique(['userId', 'productId'])
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    comment!: string;

    @Column({ type: 'decimal', precision: 2, scale: 1 })
    rating!: number;

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'user_id' })
    userId!: number;

    @ManyToOne(() => ProductOrmEntity, product => product.reviews)
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @Column({ name: 'product_id' })
    productId!: number;
}