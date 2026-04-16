import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ListProductQueryData, ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    query: ListProductQueryData = {
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    },
  ): Promise<{ data: Product[]; total: number }> {
    return await this.productRepository.findAll(query);
  }
}
