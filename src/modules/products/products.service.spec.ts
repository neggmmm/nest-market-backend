import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { FILE_STORAGE } from './application/ports/file-storage.port';
import { Product } from './domain/entities/product';
import { NotFoundException } from '@nestjs/common';

describe('Products use cases', () => {
  let listProductsUseCase: ListProductsUseCase;
  let createProductUseCase: CreateProductUseCase;
  let getProductUseCase: GetProductUseCase;
  let productRepository: {
    findAll: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
  };
  let fileStorage: {
    save: jest.Mock;
  };

  beforeEach(async () => {
    productRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    fileStorage = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProductsUseCase,
        CreateProductUseCase,
        GetProductUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: productRepository,
        },
        {
          provide: FILE_STORAGE,
          useValue: fileStorage,
        },
      ],
    }).compile();

    listProductsUseCase = module.get<ListProductsUseCase>(ListProductsUseCase);
    createProductUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    getProductUseCase = module.get<GetProductUseCase>(GetProductUseCase);
  });

  it('lists products from the repository', async () => {
    const products = [
      new Product(1, 'Keyboard', 1200, 'uploads/images/keyboard.png'),
      new Product(2, 'Mouse', 800, 'uploads/images/mouse.png'),
    ];

    productRepository.findAll.mockResolvedValue({ data: products, total: 2 });

    const result = await listProductsUseCase.execute();

    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: products, total: 2 });
  });

  it('creates a product and stores the uploaded image path', async () => {
    const savedProduct = new Product(1, 'Laptop', 25000, 'uploads/images/laptop.png');
    const uploadedFile = { path: 'uploads/images/laptop.png' } as Express.Multer.File;

    fileStorage.save.mockResolvedValue('uploads/images/laptop.png');
    productRepository.create.mockResolvedValue(savedProduct);

    const result = await createProductUseCase.execute({
      name: 'Laptop',
      price: 25000,
      file: uploadedFile,
    });

    expect(fileStorage.save).toHaveBeenCalledWith(uploadedFile);
    expect(productRepository.create).toHaveBeenCalledWith({
      name: 'Laptop',
      price: 25000,
      image: 'uploads/images/laptop.png',
    });
    expect(result).toEqual(savedProduct);
  });

  it('returns a product by id when it exists', async () => {
    const product = new Product(7, 'Monitor', 5000, 'uploads/images/monitor.png');

    productRepository.findById.mockResolvedValue(product);

    const result = await getProductUseCase.execute(7);

    expect(productRepository.findById).toHaveBeenCalledWith(7);
    expect(result).toEqual(product);
  });

  it('throws when the requested product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(getProductUseCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(productRepository.findById).toHaveBeenCalledWith(99);
  });
});
