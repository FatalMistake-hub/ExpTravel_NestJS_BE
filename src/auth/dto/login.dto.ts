import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JwtResquest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse {
  @ApiProperty({ description: 'The JWT access token' })
  token: string;

  @ApiProperty({ description: 'The type of token', default: 'Bearer' })
  type: string = 'Bearer ';

  @ApiProperty({ description: 'The refresh token', required: false })
  refreshToken: string;

  @ApiProperty({ description: 'The username of the user', required: false })
  username: string;

  @ApiProperty({ description: 'The role of the user', required: false })
  role: string;

  @ApiProperty({ description: 'Indicates if the user has a wallet', default: false })
  isWallet: boolean;

  @ApiProperty({ description: 'Account authorization details', required: false })
  accountAuthorize: string;

  constructor(
    token: string,
    refreshToken?: string,
    username?: string,
    role?: string,
    isWallet?: boolean,
    accountAuthorize?: string,
  ) {
    this.token = token;
    this.refreshToken = refreshToken || '';
    this.username = username || '';
    this.role = role || '';
    this.isWallet = isWallet || false;
    this.accountAuthorize = accountAuthorize || '';
  }
}
