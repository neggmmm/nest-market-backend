import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './presentation/http/products.controller';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { JwtService } from '@nestjs/jwt';

describe('ProductsController', () => {
  let controller: ProductsController;
  let listProductsUseCase: { execute: jest.Mock };
  let getProductUseCase: { execute: jest.Mock };
  let createProductUseCase: { execute: jest.Mock };
  let updateProductUseCase: { execute: jest.Mock };
  let deleteProductUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    listProductsUseCase = { execute: jest.fn() };
    getProductUseCase = { execute: jest.fn() };
    createProductUseCase = { execute: jest.fn() };
    updateProductUseCase = { execute: jest.fn() };
    deleteProductUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ListProductsUseCase, useValue: listProductsUseCase },
        { provide: GetProductUseCase, useValue: getProductUseCase },
        { provide: CreateProductUseCase, useValue: createProductUseCase },
        { provide: UpdateProductUseCase, useValue: updateProductUseCase },
        { provide: DeleteProductUseCase, useValue: deleteProductUseCase },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('delegates listing products to the list use case', async () => {
    const products = [{ id: 1, name: 'Keyboard', price: 1200, image: 'img.png' }];
    listProductsUseCase.execute.mockResolvedValue({ data: products, total: 1 });

    const result = await controller.getAllProducts();

    expect(listProductsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: products, page: 1, limit: 10, total: 1 });
  });

  it('passes route id to the get product use case', async () => {
    const product = { id: 5, name: 'Monitor', price: 5000, image: 'monitor.png' };
    getProductUseCase.execute.mockResolvedValue(product);

    const result = await controller.getProduct(5);

    expect(getProductUseCase.execute).toHaveBeenCalledWith(5);
    expect(result).toEqual(product);
  });

  it('passes body and uploaded file to the create product use case', async () => {
    const file = { path: 'uploads/images/laptop.png' } as Express.Multer.File;
    const dto = { name: 'Laptop', price: 25000 };
    const req = { user: { sub: 10, role: 'provider' } };
    const createdProduct = { id: 1, ...dto, userId: 10, image: file.path };

    createProductUseCase.execute.mockResolvedValue(createdProduct);

    const result = await controller.createProduct(file, dto, req);

    expect(createProductUseCase.execute).toHaveBeenCalledWith({
      name: 'Laptop',
      price: 25000,
      userId: 10,
      file,
    });
    expect(result).toEqual(createdProduct);
  });
});
