import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { JwtResquest } from './dto/login.dto';
import { PayloadType } from './types';


@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    jwtResquest: JwtResquest,
  ): Promise<
    { accessToken: string }
  > {
    const user = await this.userService.findOne(jwtResquest.email); // 1.

    const passwordMatched = await bcrypt.compare(
      jwtResquest.password,
      user.userPassword,
    );

    if (passwordMatched) {
      delete user.userPassword;
      const payload: PayloadType = {
        email: user.userEmail,
        userId: user.userId,
      };
      return {
        accessToken: this.jwtService.sign(payload, {}),
      };
    } else {
      throw new UnauthorizedException('Password does not match'); // 5.
    }
  }
}
