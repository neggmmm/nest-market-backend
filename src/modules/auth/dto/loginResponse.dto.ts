import { UserResponseDto } from './userResponse.dto';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}
