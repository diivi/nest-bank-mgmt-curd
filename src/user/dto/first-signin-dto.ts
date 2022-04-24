import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FirstSignInDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
