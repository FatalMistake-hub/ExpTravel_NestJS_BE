import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JwtResquest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'haha@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'haha',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

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

  @ApiProperty({
    description: 'Indicates if the user has a wallet',
    default: false,
  })
  isWallet: boolean;

  @ApiProperty({
    description: 'Account authorization details',
    required: false,
  })
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

export class JwtRefreshRequest {
  @ApiProperty({
    description: 'The refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class JwtRefreshResponse {
  @ApiProperty({ description: 'The JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'The refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'The type of token', default: 'Bearer' })
  tokenType: string = 'Bearer';

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
