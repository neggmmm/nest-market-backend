import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from '../../../../cart/entity/cartItem.entity';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Index()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.product)
  cartItems: CartItem[];
}
