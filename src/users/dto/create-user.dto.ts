import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @Length(10,10)
  @IsString()
  @IsNotEmpty()
  accountNumber: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsNumber()
  @IsPositive()
  balance: number;
}
