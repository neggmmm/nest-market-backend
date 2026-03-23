import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}
    @Post('register')
    register(@Body() dto:RegisterUserDto){
        return this.authService.register(dto)
    }

    @Post('login')
    login(@Body() dto:LoginUserDto){
        return this.authService.login(dto)
    }
}
