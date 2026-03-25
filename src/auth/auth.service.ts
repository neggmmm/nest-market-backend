import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/comparePassword';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refreshToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}
  async register(dto: RegisterUserDto): Promise<RegisterResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      await this.usersService.createUser({ ...dto, role: 'customer' });
      return { message: 'User created Successfully' };
    }
    return { message: 'User Cannot be created' };
  }

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const validPassword = await comparePassword(dto.password, user.password);
    if (!validPassword) {
      throw new NotAcceptableException('password is wrong!');
    }

    const userPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(userPayload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(userPayload, { expiresIn: '7d' });

    await this.refreshTokenRepo.save({
      token: refreshToken,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async me(id: number): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
