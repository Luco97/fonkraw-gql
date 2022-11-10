import { Injectable, HttpStatus } from '@nestjs/common';

import { compare } from 'bcrypt';

import { AuthService } from '@shared/auth';
import { MailService, html_template_verify } from '@shared/mail';
import { RoleModelService } from '@database/models/role';
import { UserModel, UserModelService } from '@database/models/user';

import { SignInOutput } from '../outputs/sign-in.output';
import { RegisterOutput } from '../outputs/register.output';
import { EmailVerifyModelService } from '@database/models/email-verify';
import { UpdateOutput } from '../outputs/update.output';

@Injectable()
export class UserService {
  constructor(
    private _mailService: MailService,
    private _authService: AuthService,
    private _userModel: UserModelService,
    private _roleModel: RoleModelService,
    private _emailModel: EmailVerifyModelService,
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
          Promise.all([
            this._roleModel.get_basic,
            this._emailModel.create,
          ]).then(([role, emailVerify]) =>
            this._userModel
              .create_user({
                email,
                password,
                username,
                role_uuid: role.uuid,
                emailVerify_uuid: emailVerify.uuid,
              })
              .then(() =>
                // create verify uuid with email model to confirm email
                // user not confirmed shouldn't save mangas on favorite
                {
                  this._mailService
                    .sendMail(
                      email,
                      `Welcome ${username} to Fonkraw !`,
                      html_template_verify
                        .replace(/{{ appName }}/g, 'Fonkraw')
                        .replace(/{{ username }}/g, username)
                        .replace(/{{ domain }}/g, process.env.DOMAIN)
                        .replace(/{{ path }}/g, `/${process.env.PATH}/`)
                        .replace(/{{ uuid }}/g, emailVerify.uuid),
                    )
                    .then(() =>
                      resolve({
                        message: 'user created',
                        status: HttpStatus.OK,
                      }),
                    );
                },
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

  update_info(parameters: {
    user_id: number;
    image_url: string;
    description: string;
  }): Promise<UpdateOutput> {
    const { user_id, description, image_url } = parameters;

    return new Promise<UpdateOutput>((resolve, reject) => {
      const promises: Promise<UserModel>[] = [];
      let value_updated: string = '';
      if (image_url) {
        value_updated = 'image_url';
        promises.push(
          this._userModel.update_user_image({ user_id, image_url }),
        );
      } else if (description) {
        value_updated = value_updated
          ? `${value_updated} & description`
          : 'description';
        promises.push(
          this._userModel.update_user_description({ user_id, description }),
        );
      }
      Promise.all(promises).then(() => {
        resolve({
          status: HttpStatus.OK,
          message: `succefully updated ${value_updated}`,
        });
      });
    });
  }
}
