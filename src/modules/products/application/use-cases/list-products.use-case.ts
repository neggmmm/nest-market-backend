import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(page:number, limit:number,sortBy:string,order:'ASC' | 'DESC',minPrice?: number, maxPrice?: number): Promise<{data:Product[]; total: number}> {
    return await this.productRepository.findAll(page,limit,sortBy,order, minPrice, maxPrice);
  }
}
