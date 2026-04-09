export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}

export class UserResponseDto {
  id: number;
  email: string;
  role: string;
}