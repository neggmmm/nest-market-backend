import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { LoginResponseDto } from '../../dto/loginResponse.dto';
import { LoginUserDto } from '../../dto/loginUser.dto';
import {
  AUTH_USER_READER,
} from '../ports/auth-user-reader.port';
import type { AuthUserReader } from '../ports/auth-user-reader.port';
import { PASSWORD_HASHER } from '../ports/password-hasher.port';
import type { PasswordHasher } from '../ports/password-hasher.port';
import {
  TOKEN_PROVIDER,
} from '../ports/token-provider.port';
import type { TokenProvider } from '../ports/token-provider.port';
import type { RefreshTokenRepository } from '../../domain/repositories/refreshToken.repository';
import { InjectRefreshTokenRepository } from '../ports/refresh-token-repository.token';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_USER_READER)
    private readonly authUserReader: AuthUserReader,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProvider,
    @InjectRefreshTokenRepository()
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.authUserReader.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException('User Not Found');
    }

    const validPassword = await this.passwordHasher.compare(dto.password, user.password);
    if (!validPassword) {
      throw new NotAcceptableException('password is wrong!');
    }

    const tokens = this.tokenProvider.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.refreshTokenRepository.save({
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
