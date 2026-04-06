import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { FILE_STORAGE } from './application/ports/file-storage.port';
import { ProductOrmEntity } from './infrastructure/persistence/typeorm/product.orm-entity';
import { TypeormProductRepository } from './infrastructure/persistence/typeorm/typeorm-product.repository';
import { LocalFileStorageService } from './infrastructure/storage/local-file-storage.service';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { ProductsController } from './presentation/http/products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    ListProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    TypeormProductRepository,
    LocalFileStorageService,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: TypeormProductRepository,
    },
    {
      provide: FILE_STORAGE,
      useExisting: LocalFileStorageService,
    },
  ],
})
export class ProductsModule {}
