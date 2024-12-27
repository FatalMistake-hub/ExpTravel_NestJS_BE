import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly userService: UsersService;

  constructor(
    userService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtRefreshSecret'),
    });
    this.userService = userService;
  }

  async validate(payload: any) {
    const authUser = await this.userService.findOneById(payload.sub);
    if (!authUser) {
      throw new UnauthorizedException();
    }

    return {
      attributes: authUser,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    };
  }
}
