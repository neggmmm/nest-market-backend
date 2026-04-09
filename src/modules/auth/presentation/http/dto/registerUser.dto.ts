import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto{
    @IsNotEmpty()
    name:string;

    @IsEmail()
    email:string;

    @MinLength(8)
    password:string;
}