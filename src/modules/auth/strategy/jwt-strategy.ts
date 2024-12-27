import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UsersService;

  constructor(
    userService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtAccessSecret'),
    });
    this.userService = userService;
  }

  async validate(payload: any) {
    const authUser = await this.userService.findOneById(payload.sub);
    console.log("validate",authUser)
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return authUser
  }
}
