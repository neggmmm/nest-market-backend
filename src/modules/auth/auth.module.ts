import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenOrmEntity } from './infrastructure/typeorm/refreshToken.orm-entity';
import { AuthController } from './presentation/http/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case';
import { MeUseCase } from './application/use-cases/me.use-case';
import { TypeormRefreshTokenRepository } from './infrastructure/typeorm/typeorm-refreshToken.repository';
import { REFRESH_TOKEN_REPOSITORY } from './application/ports/refresh-token-repository.token';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { BcryptPasswordHasherService } from './infrastructure/security/bcrypt-password-hasher.service';
import { TOKEN_PROVIDER } from './application/ports/token-provider.port';
import { JwtTokenProviderService } from './infrastructure/jwt/jwt-token-provider.service';
import { AUTH_USER_READER } from './application/ports/auth-user-reader.port';
import { UsersAuthReaderAdapter } from './infrastructure/users/users-auth-reader.adapter';
import { AuthGuard } from './presentation/http/guard/auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secretKey'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([RefreshTokenOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    MeUseCase,
    TypeormRefreshTokenRepository,
    BcryptPasswordHasherService,
    JwtTokenProviderService,
    UsersAuthReaderAdapter,
    AuthGuard,
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useExisting: TypeormRefreshTokenRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useExisting: BcryptPasswordHasherService,
    },
    {
      provide: TOKEN_PROVIDER,
      useExisting: JwtTokenProviderService,
    },
    {
      provide: AUTH_USER_READER,
      useExisting: UsersAuthReaderAdapter,
    },
  ],
})
export class AuthModule {}
