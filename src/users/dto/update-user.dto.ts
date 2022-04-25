import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsNumber()
  @IsOptional()
  balance?: number;
}
