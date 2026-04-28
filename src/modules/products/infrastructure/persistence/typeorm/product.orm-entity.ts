import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from '../../../../cart/infrastructure/typeorm/cartItem.entity';
import { User } from '../../../../users/users.entity';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: true })
  userId: number;

  // Nullable keeps the app compatible with products that existed before
  // ownership was introduced. New products still receive userId on creation.
  @ManyToOne(() => User, (user: User) => user.products, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  owner: User;

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
