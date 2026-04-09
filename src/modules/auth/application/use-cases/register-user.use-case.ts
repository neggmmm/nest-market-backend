import { Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import type { PasswordHasher } from "../ports/password-hasher.port";
import { PASSWORD_HASHER } from "../ports/password-hasher.port";
import { RegisterUserDto } from "../../presentation/http/dto/registerUser.dto";
import { RegisterResponseDto } from "../../presentation/http/dto/registerResponse.dto";
import { AUTH_USER_READER, type AuthUserReader} from "../ports/auth-user-reader.port";


@Injectable()
export class RegisterUserUseCase {
    constructor(
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
        @Inject(AUTH_USER_READER)
    private readonly authUserReader: AuthUserReader
    ) {}

    async execute(dto: RegisterUserDto): Promise<RegisterResponseDto> {
        const existingUser = await this.authUserReader.findByEmail(dto.email);

        if (existingUser) {
            throw new NotAcceptableException("Email already exists");
        }

        const hashedPassword = await this.passwordHasher.hash(dto.password, 10);

        await this.authUserReader.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: "user",
        });

        return {
      message: "User registered successfully",
        };
    }
}
