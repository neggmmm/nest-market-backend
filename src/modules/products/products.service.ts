import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository : Repository<Product>,
    ){}
    async getAllProducts(){
        return this.productRepository.find()
    }

    async createProduct(dto:CreateProductDto, file:Express.Multer.File){
        const imagePath = file? file.path : undefined;

        const product = this.productRepository.create({...dto,image:imagePath})

        return this.productRepository.save(product)
    }

    async findOne(id:number): Promise<Product>{
        const product = await this.productRepository.findOneBy({ id });
        if(!product){
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async updateProduct(id:number,dto:UpdateProductDto):Promise<Product>{
        const product = await this.findOne(id);
        Object.assign(product,dto)
        return this.productRepository.save(product);
    }
    async deleteProduct(id:number):Promise<void>{
        await this.productRepository.delete(id)
    }
}
