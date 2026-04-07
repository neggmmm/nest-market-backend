import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../domain/entities/refreshToken';
import type { RefreshTokenRepository } from '../../domain/repositories/refreshToken.repository';
import type { SaveRefreshTokenData } from '../../domain/repositories/refreshToken.repository';
import { RefreshTokenOrmEntity } from './refreshToken.orm-entity';

@Injectable()
export class TypeormRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly ormRepository: Repository<RefreshTokenOrmEntity>,
  ) {}

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.ormRepository.findOne({
      where: { token },
      relations: { user: true },
    });

    if (!refreshToken) {
      return null;
    }
    return this.toDomain(refreshToken);
  }

  async save(data: SaveRefreshTokenData): Promise<RefreshToken> {
    const refreshToken = this.ormRepository.create({
      token: data.token,
      expiresAt: data.expiresAt,
      user: { id: data.userId },
    });

    const savedRefreshToken = await this.ormRepository.save(refreshToken);
    const refreshTokenWithUser = await this.ormRepository.findOneOrFail({
      where: { id: savedRefreshToken.id },
      relations: { user: true },
    });

    return this.toDomain(refreshTokenWithUser);
  }

  async deleteById(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.ormRepository.delete({ token });
  }

  private toDomain(refreshToken: RefreshTokenOrmEntity): RefreshToken {
    return new RefreshToken(
      refreshToken.id,
      refreshToken.token,
      refreshToken.expiresAt,
      refreshToken.user.id,
    );
  }
}
