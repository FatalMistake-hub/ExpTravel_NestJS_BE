import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserViewDto {
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  urlImage?: string;

  @IsString()
  role: string = 'USER';

  @IsBoolean()
  isEnabled: boolean = true;
}
