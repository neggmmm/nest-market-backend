import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../../../common/enum/role.enum';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';

export interface UpdateProductCommand {
  id: number;
  userId: number;
  userRole: string;
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

    const isOwner = existingProduct.userId === command.userId;
    const isAdmin = [Role.ADMIN, Role.SUPERADMIN].includes(command.userRole as Role);

    // Product changes are resource-based: the owner can edit their product,
    // while admins can moderate any product.
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Only the product owner or an admin can update this product');
    }

    return this.productRepository.update(command.id, {
      name: command.name,
      price: command.price,
    });
  }
}
