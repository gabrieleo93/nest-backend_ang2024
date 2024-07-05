import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';



export class RegisterUserDto {

    @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsInt()
  @IsNotEmpty()
  edad: number;


}