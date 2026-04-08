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
import { RegisterUserDto } from '../../dto/registerUser.dto';
import { LoginUserDto } from '../../dto/loginUser.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';
import { MeUseCase } from '../../application/use-cases/me.use-case';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly meUseCase: MeUseCase,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res) {
    const result = await this.loginUserUseCase.execute(dto);
    
    // cookies setting for dev
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
  refresh(@Req() req) {
    const token = req.cookies?.refresh_token;
    if (!token) {
      throw new UnauthorizedException('No refresh token');
    }

    return this.refreshTokenUseCase.execute(token);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req) {
    return this.meUseCase.execute(req.user.sub);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    const result = await this.logoutUserUseCase.execute(req.cookies?.refresh_token);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return result;
  }
}
