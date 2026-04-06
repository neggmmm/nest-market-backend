import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';

export interface UpdateProductCommand {
  id: number;
  name?: string;
  price?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const existingProduct = await this.productRepository.findById(command.id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    return this.productRepository.update(command.id, {
      name: command.name,
      price: command.price,
    });
  }
}
