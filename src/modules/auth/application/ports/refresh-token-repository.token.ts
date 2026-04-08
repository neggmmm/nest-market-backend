import { Inject } from '@nestjs/common';

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export const InjectRefreshTokenRepository = () => Inject(REFRESH_TOKEN_REPOSITORY);
