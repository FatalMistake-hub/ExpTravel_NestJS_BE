import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegistrationDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  userPassword: string;
  
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  matchingPassword: string;
}
