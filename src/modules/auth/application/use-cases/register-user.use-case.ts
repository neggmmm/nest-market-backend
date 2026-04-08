import { Inject, Injectable } from '@nestjs/common';
import { RegisterResponseDto } from '../../dto/registerResponse.dto';
import { RegisterUserDto } from '../../dto/registerUser.dto';
import {
  AUTH_USER_READER,
} from '../ports/auth-user-reader.port';
import type { AuthUserReader } from '../ports/auth-user-reader.port';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    // Application only knows it needs a user reader/creator contract.
    @Inject(AUTH_USER_READER)
    private readonly authUserReader: AuthUserReader,
  ) {}

  async execute(dto: RegisterUserDto): Promise<RegisterResponseDto> {
    const existingUser = await this.authUserReader.findByEmail(dto.email);

    if (existingUser) {
      return { message: 'User Cannot be created' };
    }

    await this.authUserReader.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: 'customer',
    });

    return { message: 'User created Successfully' };
  }
}
