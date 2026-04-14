import { Product } from '../entities/product';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  findAll(page:number, limit:number,sortBy:string,order: 'ASC' | 'DESC', minPrice?:number, maxPrice?:number,search?:string): Promise<{data: Product[]; total: number}>;
  findById(id: number): Promise<Product | null>;
  create(data: CreateProductRepositoryData): Promise<Product>;
  update(id: number, data: UpdateProductRepositoryData): Promise<Product>;
  delete(id: number): Promise<void>;
}

export interface CreateProductRepositoryData {
  name: string;
  price: number;
  image?: string;
}

export interface UpdateProductRepositoryData {
  name?: string;
  price?: number;
  image?: string;
}
