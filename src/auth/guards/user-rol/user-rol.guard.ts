import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRolGuard implements CanActivate {
  constructor (
    protected readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean>
  
  {
    const validRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler() );
    console.log("=========================")
    console.log('Este es el Guard', validRoles);
    console.log("=========================")
    return true;
  }
}
