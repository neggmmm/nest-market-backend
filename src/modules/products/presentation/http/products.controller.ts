import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../domain/entities/product';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  async getAllProducts(
    @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number =1,
    @Query('limit',new DefaultValuePipe(10), ParseIntPipe) limit : number = 2,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ): Promise<{data:Product[]; page:number;  limit:number;  total:number}> {
    limit = Math.min(limit,50)
    const result = await this.listProductsUseCase.execute(page,limit,sortBy,order,minPrice, maxPrice,search);
    return {
      data : result.data,
      page,
      limit,
      total : result.total
    }
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.getProductUseCase.execute(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(new Error('Only jpeg, png, and webp images are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ): Promise<Product> {
    return this.createProductUseCase.execute({
      name: dto.name,
      price: dto.price,
      file,
    });
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.updateProductUseCase.execute({
      id,
      name: dto.name,
      price: dto.price,
    });
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteProductUseCase.execute(id);
  }
}
