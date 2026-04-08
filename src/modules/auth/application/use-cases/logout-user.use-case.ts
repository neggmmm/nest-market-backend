import { Injectable } from '@nestjs/common';
import type { RefreshTokenRepository } from '../../domain/repositories/refreshToken.repository';
import { InjectRefreshTokenRepository } from '../ports/refresh-token-repository.token';

@Injectable()
export class LogoutUserUseCase {
  constructor(
    @InjectRefreshTokenRepository()
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(token?: string): Promise<{ message: string }> {
    if (token) {
      await this.refreshTokenRepository.deleteByToken(token);
    }

    return { message: 'Logged out successfully' };
  }
}
