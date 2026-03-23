import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './guard/auth.guard';

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
    async login(@Body() dto:LoginUserDto,@Res({passthrough:true}) res){
        const result = await this.authService.login(dto)
        res.cookie('access_token',result.accessToken,{
            httpOnly:true,
            secure:false
        })
        return result
    }

    @Get('me')
    @UseGuards(AuthGuard)
    me(@Req() req){
        return this.authService.me(req.user.sub)
    }

    @Post('logout')
    logout(@Res ({passthrough:true}) res){
        res.clearCookie("access_token");
        return { message: "Logged out"}
    }
}
