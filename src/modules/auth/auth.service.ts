import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/modules/users/users.service';
import { JwtResquest } from './dto/jwt.dto';
import { PayloadType } from './types';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private authRefreshTokenService: AuthRefreshTokenService,
  ) {}
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.user_password);

    if (isMatch) {
      return user;
    }
    return null;
  }
  async login(
    jwtResquest: JwtResquest,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findOne(jwtResquest.email); // 1.
    if (!user) {
      throw new UnauthorizedException('User not found'); // 4.
    }
    const passwordMatched = await bcrypt.compare(
      jwtResquest.password,
      user.user_password,
    );

    if (passwordMatched) {
      delete user.user_password;
      return await this.authRefreshTokenService.generateTokenPair(user); // 2.
    } else {
      throw new UnauthorizedException('Password does not match'); // 5.
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    // Promise<{ accessToken: string, refreshToken: string }>
    const payload = this.jwtService.decode(refreshToken, {}) as any;
    console.log(payload);
    const dateExp = new Date(payload.exp * 1000);
    const user = await this.userService.findOneById(payload.sub);

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    return await this.authRefreshTokenService.generateTokenPair(
      user,
      refreshToken,
      dateExp,
    ); // 3.
  }
}
