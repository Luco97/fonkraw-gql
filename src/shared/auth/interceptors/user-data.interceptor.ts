import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { AuthService } from '../service/auth.service';

@Injectable()
export class UserDataInterceptor implements NestInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.getArgByIndex(2).req;
    const {
      context: { author_id, extra, type, username },
      sub,
    } = this._authService.userObject(req.headers?.authorization);

    req.headers['user_id'] = extra.toString();
    req.headers['user_name'] = username;
    req.headers['user_author_id'] = author_id.toString();

    return next.handle();
  }
}
