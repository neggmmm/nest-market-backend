import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import {
  AuthUser,
  AuthUserReader,
  CreateAuthUserData,
} from '../../application/ports/auth-user-reader.port';

@Injectable()
export class UsersAuthReaderAdapter implements AuthUserReader {
  constructor(private readonly usersService: UsersService) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email);
    return user ? this.toAuthUser(user) : null;
  }

  async findById(id: number): Promise<AuthUser | null> {
    const user = await this.usersService.findOne(id);
    return user ? this.toAuthUser(user) : null;
  }

  async create(data: CreateAuthUserData): Promise<AuthUser> {
    const user = await this.usersService.createUser(data);
    return this.toAuthUser(user);
  }

  private toAuthUser(user: {
    id: number;
    email: string;
    role: string;
    password?: string;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      password: user.password,
    };
  }
}
