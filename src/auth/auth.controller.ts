import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
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
    @InjectRepository(RefreshToken)
    private readonly authService: AuthService,
    private refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}
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
    return result;
  }

  @Post('refreshToken')
  async refresh(@Body('refreshToken') token: string) {
    const stored = await this.refreshTokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!stored) {
      throw new UnauthorizedException();
    }
    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Token Expired');
    }
    const payload = {
      sub: stored.user.id,
      email: stored.user.email,
    };
    const newAccessToken = this.jwtService.sign(payload);

    return {
      accessToken: newAccessToken,
    };
  }
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req) {
    return this.authService.me(req.user.sub);
  }

  @Post('logout')
  async logout(@Req() req) {
    const token = req.cookiees.refresh_token;
    await this.refreshTokenRepo.delete({ token });
    return { message: 'Logged out' };
  }
}
