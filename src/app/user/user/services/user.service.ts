import { Injectable, HttpStatus } from '@nestjs/common';

import { compare } from 'bcrypt';

import { AuthService } from '@shared/auth';
import { RoleModelService } from '@database/models/role';
import { UserModelService } from '@database/models/user';

import { SignInOutput } from '../outputs/sign-in.output';
import { RegisterOutput } from '../outputs/register.output';

@Injectable()
export class UserService {
  constructor(
    private _authService: AuthService,
    private _userModel: UserModelService,
    private _roleModel: RoleModelService,
  ) {}

  create_user(parameters: {
    email: string;
    username: string;
    password: string;
  }): Promise<RegisterOutput> {
    const { email, username, password } = parameters;
    return new Promise<RegisterOutput>((resolve, reject) => {
      this._userModel.find_one({ email, username }).then((count) => {
        if (count) {
          resolve({
            status: HttpStatus.CONFLICT,
            message: 'email or username on use',
          });
        } else {
          this._roleModel.get_basic.then((role) =>
            this._userModel
              .create_user({ email, password, username, role })
              .then(() =>
                resolve({ message: 'user created', status: HttpStatus.OK }),
              ),
          );
        }
      });
    });
  }

  sign_in_user(parameters: { email: string; password: string }) {
    const { email, password } = parameters;
    return new Promise<SignInOutput>((resolve, reject) =>
      this._userModel.find_one_by_email(email).then((user) => {
        if (!user) {
          resolve({
            message: 'user not found',
            status: HttpStatus.NOT_FOUND,
          });
        } else {
          compare(password, user.password).then((is_valid) => {
            if (!is_valid) {
              resolve({
                message: 'user not found',
                status: HttpStatus.NOT_FOUND,
              });
            } else {
              resolve({
                message: `holiwis ${user.username} gil ql`,
                status: HttpStatus.OK,
                token: this._authService.genJWT({
                  id: user.id,
                  name: user.username,
                  type: user.role.role_name,
                }),
              });
            }
          });
        }
      }),
    );
  }
}
