import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AUTH_USER_READER,
} from '../ports/auth-user-reader.port';
import type { AuthUserReader } from '../ports/auth-user-reader.port';
import {
  TOKEN_PROVIDER,
} from '../ports/token-provider.port';
import type { TokenProvider } from '../ports/token-provider.port';
import type { RefreshTokenRepository } from '../../domain/repositories/refreshToken.repository';
import { InjectRefreshTokenRepository } from '../ports/refresh-token-repository.token';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_USER_READER)
    private readonly authUserReader: AuthUserReader,
    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProvider,
    @InjectRefreshTokenRepository()
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(token: string): Promise<RefreshTokenResult> {
    const storedToken = await this.refreshTokenRepository.findByToken(token);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteById(storedToken.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.authUserReader.findById(storedToken.userId);
    if (!user) {
      throw new UnauthorizedException('User not found for refresh token');
    }

    await this.refreshTokenRepository.deleteById(storedToken.id);

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

    return tokens;
  }
}
