import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from 'src/utils/comparePassword';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
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

  // Validate the refresh token: check if it exists in DB and hasn't expired
  async validateRefreshToken(token: string): Promise<RefreshToken> {
    // Find the refresh token in the database, including the related user
    const stored = await this.refreshTokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    // If token not found, throw unauthorized
    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // If token has expired, delete it and throw unauthorized
    if (stored.expiresAt < new Date()) {
      await this.refreshTokenRepo.delete(stored.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Return the stored token with user
    return stored;
  }

  async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Validate the incoming refresh token
    const stored = await this.validateRefreshToken(token);

    // Delete the old refresh token for security (token rotation)
    await this.refreshTokenRepo.delete(stored.id);

    // Create payload for new tokens
    const payload = {
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    };

    // Generate new access token (short-lived)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Generate new refresh token (long-lived)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Save the new refresh token to the database
    await this.refreshTokenRepo.save({
      token: refreshToken,
      user: stored.user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    // Return both new tokens
    return { accessToken, refreshToken };
  }
  async me(id: number): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
