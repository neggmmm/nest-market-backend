import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';
import { updateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService : UsersService
    ){}
    @Get()
    findAll():Promise<User[]>{
        return this.usersService.findAll();
    }
    @Get(':id')
    findOne(@Param('id',ParseIntPipe)id:number):Promise<User | null>{
        return this.usersService.findOne(id)
    }
    @Post()
    createUser(@Body() dto: CreateUserDto):Promise<User>{
        return this.usersService.createUser(dto)
    }

    @Patch(':id')
    updateUser(
        @Param('id',ParseIntPipe)id:number,
        @Body() dto:updateUserDto):Promise<User | null>{
        return this.usersService.updateUser(id,dto)
    }
    @Delete(':id')
    deleteUser(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.usersService.deleteUser(id)
    }
}
