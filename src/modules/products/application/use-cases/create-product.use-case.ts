import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE } from '../ports/file-storage.port';
import type { FileStorage } from '../ports/file-storage.port';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';
import { AUDIT_LOG } from '../ports/audit-log.port';
import type { AuditLogPort } from '../ports/audit-log.port'

export interface CreateProductCommand {
  name: string;
  price: number;
  userId: number;
  stock?: number;
  lowStockThreshold?: number;
  file?: Express.Multer.File;
  categoryId?: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorage,
    @Inject(AUDIT_LOG)
    private readonly audit: AuditLogPort
  ) { }

  async execute(command: CreateProductCommand): Promise<Product> {
    let image: string | undefined;
    return await this.productRepository.transaction(async (repo) => {
      image = await this.fileStorage.save(command.file);

      const product = await repo.create({
        name: command.name,
        price: command.price,
        stock: command.stock ?? 0,
        lowStockThreshold: command.lowStockThreshold ?? 10,
        userId: command.userId,
        image,
        categoryId: command.categoryId,
      });

      await this.audit.log({
        action:
          "PRODUCT_CREATED",

        entity:
          "Product",

        entityId:
          product.id,

        performedBy:
          command.userId
      });

      return product;
    });
  }
}
