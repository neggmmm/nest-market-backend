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
  ) {}

  async findAll(): Promise<Product[]> {
    const products = await this.ormRepository.find();
    return products.map((product) => this.toDomain(product));
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
