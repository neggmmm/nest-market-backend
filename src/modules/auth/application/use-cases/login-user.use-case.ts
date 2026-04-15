import { Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { LoginUserDto } from "../../presentation/http/dto/loginUser.dto";
import { LoginResponseDto } from "../../presentation/http/dto/loginResponse.dto";
import type { PasswordHasher } from "../ports/password-hasher.port";
import { PASSWORD_HASHER } from "../ports/password-hasher.port";
import type { AuthUserReader } from "../ports/auth-user-reader.port";
import { AUTH_USER_READER } from "../ports/auth-user-reader.port";
import type { TokenProvider } from "../ports/token-provider.port";
import { TOKEN_PROVIDER } from "../ports/token-provider.port";
import type { RefreshTokenRepository } from "../../domain/repositories/refreshToken.repository";
import { InjectRefreshTokenRepository } from "../ports/refresh-token-repository.token";

@Injectable()
export class Login {
    constructor(
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasher,
        @Inject(AUTH_USER_READER)
        private readonly authUserReader: AuthUserReader,
        @Inject(TOKEN_PROVIDER)
        private readonly tokenProvider: TokenProvider,
        @InjectRefreshTokenRepository()
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) {}

    async execute(dto: LoginUserDto): Promise<LoginResponseDto> {
        const user = await this.authUserReader.findByEmail(dto.email);
        
        if (!user || !user.password) {
            throw new NotAcceptableException("Email or password is wrong");
        }

        const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password);
        
        if (!isPasswordValid) {
            throw new NotAcceptableException("Email or password is wrong");
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