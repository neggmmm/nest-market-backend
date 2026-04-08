export interface AuthTokenPayload {
  sub: number;
  email: string;
  role: string;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export const TOKEN_PROVIDER = Symbol('TOKEN_PROVIDER');

export interface TokenProvider {
  generateTokens(payload: AuthTokenPayload): GeneratedTokens;
}
