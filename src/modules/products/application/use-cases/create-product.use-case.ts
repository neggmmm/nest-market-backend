import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE } from '../ports/file-storage.port';
import type { FileStorage } from '../ports/file-storage.port';
import {
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';

export interface CreateProductCommand {
  name: string;
  price: number;
  file?: Express.Multer.File;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorage,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const image = await this.fileStorage.save(command.file);

    return this.productRepository.create({
      name: command.name,
      price: command.price,
      image,
    });
  }
}
