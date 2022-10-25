import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { Repository } from 'typeorm';
import { RoleModel } from '../role/role.model';

@Injectable()
export class UserModelService {
  constructor(
    @InjectRepository(UserModel) private _userRepo: Repository<UserModel>,
  ) {}

  create_user(parameters: {
    email: string;
    username: string;
    password: string;
    role: RoleModel;
  }): Promise<UserModel> {
    const { email, password, username, role } = parameters;
    return this._userRepo.save(
      this._userRepo.create({
        email,
        password,
        username,
        role,
      }),
    );
  }

  find_one(parameters: { email: string; username: string }): Promise<number> {
    const { email, username } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.email', 'user.username'])
      .where('user.email =: email', { email })
      .orWhere('user.username = :username', { username })
      .getCount();
  }

  find_one_by_email(email: string): Promise<UserModel> {
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.email', 'user.username', 'user.password'])
      .where('user.email =: email', { email })
      .getOne();
  }
}
