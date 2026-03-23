import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/comparePassword';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { LoginResponseDto } from './dto/loginResponse.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService : UsersService,
        private readonly jwtService : JwtService
    ){}
    async register(dto:RegisterUserDto):Promise<string>{
        const user = await this.usersService.findByEmail(dto.email);
        if(!user){
            await this.usersService.createUser({...dto,role:'customer'})
            return 'user created'
        }
        return 'cannot be created!'
    }

    async login(dto:LoginUserDto):Promise<LoginResponseDto>{
        const user = await this.usersService.findByEmail(dto.email)
        if(!user){
            throw new NotFoundException('User Not Found')
        }
        const validPassword = await comparePassword(dto.password, user.password);
        if(!validPassword){
            throw new NotAcceptableException("password is wrong!")
        }

        const userPayload = {sub: user.id, email: user.email, role: user.role}
        const accessToken = this.jwtService.sign(userPayload)
        return {accessToken, 
            user:{
            id:user.id,
            email:user.email,
            role:user.role
        }}
    }

    async me(id:number):Promise<User | null>{
        return this.usersService.findOne(id)
    }
}
