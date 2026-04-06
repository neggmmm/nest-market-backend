import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete(id);
  }
}
