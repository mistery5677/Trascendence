import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase()) 
  identity!: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(6)
  password!: string;
}
