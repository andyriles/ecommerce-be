import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UsersDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
