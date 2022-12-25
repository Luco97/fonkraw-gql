import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Payload } from '../interface/payload.interface';

@Injectable()
export class AuthService {
  constructor(private _jwtService: JwtService) {}

  genJWT(object: {
    id: number;
    author_id: number;
    name: string;
    type: string;
  }): string {
    const { id, name, type, author_id } = object;
    return this._jwtService.sign({
      sub: name,
      context: {
        username: name,
        extra: id,
        type,
        author_id,
      },
    });
  }

  validateToken(token: string): boolean {
    try {
      const validation = this._jwtService.verify<Payload>(token, {
        secret: process.env.SECRET_KEY,
      });
      if (validation?.context?.username && validation?.context?.extra)
        return true;
    } catch (error) {
      return false;
    }
  }

  userID(token: string): number {
    try {
      const payload = this._jwtService.verify<Payload>(token, {
        secret: process.env.SECRET_KEY,
      });
      if (payload?.context?.username && payload?.context?.extra)
        return payload?.context?.extra;
    } catch (error) {
      return 0;
    }
  }

  userRole(token: string): string {
    try {
      const payload = this._jwtService.verify<Payload>(token, {
        secret: process.env.SECRET_KEY,
      });
      if (payload?.context?.username && payload?.context?.extra)
        return payload?.context?.type;
    } catch (error) {
      return '';
    }
  }

  userObject(token: string): Payload {
    try {
      const payload = this._jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      if (payload?.context?.username && payload?.context?.extra)
        return {
          sub: payload?.context?.username,
          context: {
            username: payload?.context?.username,
            extra: payload?.context?.extra,
            type: payload?.context?.type,
            author_id: payload?.context?.author_id,
          },
        };
    } catch (error) {
      return {
        sub: '',
        context: {
          username: '',
          extra: -1,
          type: '',
          author_id: 0,
        },
      };
    }
  }
}
