import { UserResponseDto } from "./userResponse.dto";

export class LoginResponseDto{
    accessToken : string;
    user: UserResponseDto
}