import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../../../common/enum/role.enum';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';

export interface DeleteProductCommand {
  id: number;
  userId: number;
  userRole: string;
}

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const isOwner = product.userId === command.userId;
    const isAdmin = [Role.ADMIN, Role.SUPERADMIN].includes(command.userRole as Role);

    // Delete uses the same ownership rule as update so both mutations stay consistent.
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Only the product owner or an admin can delete this product');
    }

    await this.productRepository.delete(command.id);
  }
}
