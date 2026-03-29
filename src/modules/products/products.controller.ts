import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Product } from './product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
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
    @UseInterceptors(FileInterceptor('image',{dest:'./uploads/images'}))
    createProduct(@UploadedFile() file: Express.Multer.File,@Body() dto:CreateProductDto) :Promise<Product>{
        return this.productService.createProduct(dto,file)
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
