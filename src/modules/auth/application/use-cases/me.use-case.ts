import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_USER_READER,
} from '../ports/auth-user-reader.port';
import type { AuthUserReader } from '../ports/auth-user-reader.port';

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(AUTH_USER_READER)
    private readonly authUserReader: AuthUserReader,
  ) {}

  execute(userId: number) {
    return this.authUserReader.findById(userId);
  }
}
