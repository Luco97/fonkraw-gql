import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { AuthService } from '@shared/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req: Request = context.switchToHttp().getNext().req;
    return this._authService.validateToken(req.headers.authorization);
  }
}
