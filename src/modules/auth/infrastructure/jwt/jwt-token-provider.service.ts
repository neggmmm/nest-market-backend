import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthTokenPayload,
  GeneratedTokens,
  TokenProvider,
} from '../../application/ports/token-provider.port';

@Injectable()
export class JwtTokenProviderService implements TokenProvider {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(payload: AuthTokenPayload): GeneratedTokens {
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
