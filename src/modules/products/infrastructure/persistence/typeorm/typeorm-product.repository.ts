import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProductRepositoryData,
  ProductRepository,
  UpdateProductRepositoryData,
} from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product';
import { ProductOrmEntity } from './product.orm-entity';

@Injectable()
export class TypeormProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepository: Repository<ProductOrmEntity>,
  ) { }

  async findAll(page: number, limit: number, sortBy: string, order: 'ASC' | 'DESC', minPrice?: number, maxPrice?: number, search?: string): Promise<{ data: Product[]; total: number }> {
    const query = this.ormRepository.createQueryBuilder('product')
      .select(['product.id', 'product.name', 'product.price', 'product.image'])

    if (search) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }
    
    if (minPrice) {
      query.andWhere('product.price>= :minPrice', { minPrice })
    }

    if (maxPrice) {
      query.andWhere('product.price<= :maxPrice', { maxPrice })
    }

    const allowedSortFields = ['id', 'price', 'name'];

    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'id';
    }
    query.orderBy(`product.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await query.getManyAndCount()

    return {
      data: products.map(this.toDomain),
      total
    }
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.ormRepository.findOneBy({ id });
    return product ? this.toDomain(product) : null;
  }

  async create(data: CreateProductRepositoryData): Promise<Product> {
    const product = this.ormRepository.create(data);
    const savedProduct = await this.ormRepository.save(product);
    return this.toDomain(savedProduct);
  }

  async update(id: number, data: UpdateProductRepositoryData): Promise<Product> {
    await this.ormRepository.update(id, data);
    const updatedProduct = await this.ormRepository.findOneByOrFail({ id });
    return this.toDomain(updatedProduct);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  private toDomain(product: ProductOrmEntity): Product {
    return new Product(product.id, product.name, Number(product.price), product.image);
  }
}
