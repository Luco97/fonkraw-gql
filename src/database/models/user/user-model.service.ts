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

  // Manga features
  manga_creator(parameters: { user_id: number; manga_id: number }) {
    const { user_id, manga_id } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .leftJoin('user.author_profile', 'author_profile')
      .leftJoin('author_profile.init_mangas', 'init_mangas')
      .where('init_mangas.id = :manga_id', { manga_id })
      .andWhere('user.id = :user_id', { user_id })
      .getCount();
  }

  // Invite feature
  // Valid user to send invitation, if return value > 0
  invite_creator(parameters: { user_id: number; manga_id: number }) {
    const { manga_id, user_id } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .leftJoin('user.author_profile', 'author_profile')
      .leftJoin('author_profile.init_mangas', 'init_mangas')
      .where('init_mangas.id = :manga_id', { manga_id })
      .andWhere('user.id = :user_id', { user_id })
      .getCount();
  }
}
