import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/utils/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest();
    const access_token = user.headers.authorization?.split(' ')?.[1];
    const userRoles = this.jwtService.decode(access_token)?.role;
    return requiredRoles.some((role) => role === userRoles);
  }
}
