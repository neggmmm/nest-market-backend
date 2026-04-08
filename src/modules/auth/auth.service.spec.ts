import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { AUTH_USER_READER } from './application/ports/auth-user-reader.port';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_PROVIDER } from './application/ports/token-provider.port';
import { REFRESH_TOKEN_REPOSITORY } from './application/ports/refresh-token-repository.token';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserUseCase,
        {
          provide: AUTH_USER_READER,
          useValue: { findByEmail: jest.fn() },
        },
        {
          provide: PASSWORD_HASHER,
          useValue: { compare: jest.fn() },
        },
        {
          provide: TOKEN_PROVIDER,
          useValue: { generateTokens: jest.fn() },
        },
        {
          provide: REFRESH_TOKEN_REPOSITORY,
          useValue: { save: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get<LoginUserUseCase>(LoginUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });
});
