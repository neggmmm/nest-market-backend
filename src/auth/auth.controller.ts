import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './guard/auth.guard';
import { RefreshToken } from './refreshToken.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) { }
  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res) {
    const result = await this.authService.login(dto);
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false,
    });
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
    });
    return result;
  }

  @Post('refreshToken')
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req) {
    return this.authService.me(req.user.sub);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    const token = req.cookies?.refresh_token;
    if (token) {
      await this.refreshTokenRepo.delete({ token });
    }
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return { message: 'Logged out successfully' };
  }
}
