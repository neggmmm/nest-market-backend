import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './presentation/http/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case';
import { MeUseCase } from './application/use-cases/me.use-case';
import { AuthGuard } from './presentation/http/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: RegisterUserUseCase, useValue: { execute: jest.fn() } },
        { provide: LoginUserUseCase, useValue: { execute: jest.fn() } },
        { provide: RefreshTokenUseCase, useValue: { execute: jest.fn() } },
        { provide: LogoutUserUseCase, useValue: { execute: jest.fn() } },
        { provide: MeUseCase, useValue: { execute: jest.fn() } },
        { provide: AuthGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
