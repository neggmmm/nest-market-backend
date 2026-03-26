import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService : ProductsService
    ){}
    @Get()
    getAllProducts(){
        return this.productService.getAllProducts()
    }

    @Get(':id')
    getProduct(@Param('id', ParseIntPipe) id:number): Promise<Product>{
        return this.productService.findOne(id)
    }

    @Post()
    createProduct(@Body() dto:CreateProductDto) :Promise<Product>{
        return this.productService.createProduct(dto)
    }

    @Patch(':id')
    updateProduct(
        @Param('id', ParseIntPipe) id:number,
        @Body() dto: UpdateProductDto
    ): Promise<Product>{
        return this.productService.updateProduct(id, dto)
    }

    @Delete(':id')
    deleteProduct(@Param('id', ParseIntPipe) id:number): Promise<void>{
        return this.productService.deleteProduct(id)
    }
}
