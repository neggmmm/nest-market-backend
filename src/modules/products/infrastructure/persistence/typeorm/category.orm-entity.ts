import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('categories')
export class CategoryOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => ProductOrmEntity, (product) => product.category)
  products: ProductOrmEntity[];
}
