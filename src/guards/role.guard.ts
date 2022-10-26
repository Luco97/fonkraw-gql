import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { RoleModelService } from '@database/models/role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private _authService: AuthService,
    private _roleModelService: RoleModelService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req: Request = context.switchToHttp().getNext().req;
    // needs @SetMetadata('roles', ['basic', 'admin'])
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const {
      context: { type, extra },
    } = this._authService.userObject(req.headers?.authorization);
    if (!(extra || type)) return false;
    return new Promise((resolve, reject) =>
      this._roleModelService
        .find_one(type)
        .then(
          (role) =>
            roles.includes(role.role_name) ? resolve(true) : resolve(false),
          (error) => resolve(false),
        )
        .catch((error) => resolve(false)),
    );
  }
}
