import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { updateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { hashpassword } from 'src/utils/hashPassword';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ){}

    findAll():Promise<User[]>{
        return this.userRepository.find();
    }

    findOne(id:number): Promise<User | null>{
        const user = this.userRepository.findOneBy({id});
        if(!user){
            throw new NotFoundException('User Not Found')
        }
        return user;
    }
    async createUser(dto:CreateUserDto):Promise<User>{
        const hashedPaswword = await hashpassword(dto.password)
        const user = this.userRepository.create({
            ...dto,
            password:hashedPaswword});
        return this.userRepository.save(user)
    }
    async updateUser(id:number,dto:updateUserDto):Promise<User | null>{
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User Not Found')
        }
        Object.assign(user,dto)
        return this.userRepository.save(user);
    }
    async deleteUser(id:number): Promise<void>{
        await this.userRepository.delete(id);
    }
}
