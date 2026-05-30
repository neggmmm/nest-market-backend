import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';

@Injectable()
export class GetLowStockProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(ownerId: number): Promise<Product[]> {
    return this.productRepository.findLowStockByOwner(ownerId);
  }
}
