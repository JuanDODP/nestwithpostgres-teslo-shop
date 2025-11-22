import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRolGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    console.log("=========================")
    console.log('Este es el Guard', validRoles);
    console.log("=========================")
    if (!user)
      throw new BadRequestException('User not found in request');
    console.log({ userRole: user.rol })
    for (const rol of user.rol) {
      if (validRoles.includes(rol)) {
        return true;
      }
    }
    throw new ForbiddenException('User role not allowed');
  }
}
