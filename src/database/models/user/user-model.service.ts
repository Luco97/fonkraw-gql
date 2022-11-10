import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserModel } from './user.model';
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
    role_uuid: string;
    emailVerify_uuid: string;
  }): Promise<UserModel> {
    const { email, password, username, role_uuid, emailVerify_uuid } =
      parameters;
    return this._userRepo.save(
      this._userRepo.create({
        email,
        password,
        username,
        role: { uuid: role_uuid },
        activation: { uuid: emailVerify_uuid },
      }),
    );
  }

  update_user_image(parameters: {
    user_id: number;
    image_url: string;
  }): Promise<UserModel> {
    const { image_url, user_id } = parameters;
    return this._userRepo.save(
      { id: user_id, image_url },
      { listeners: false },
    );
  }

  update_user_description(parameters: {
    user_id: number;
    description: string;
  }): Promise<UserModel> {
    const { description, user_id } = parameters;
    return this._userRepo.save(
      { id: user_id, description },
      { listeners: false },
    );
  }

  update_user_password(parameters: {
    user_id: number;
    password: string;
  }): Promise<UserModel> {
    const { password, user_id } = parameters;
    return this._userRepo.save({ id: user_id, password });
  }

  find_one(parameters: { email: string; username: string }): Promise<number> {
    const { email, username } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.email', 'user.username'])
      .where('user.email = :email', { email })
      .orWhere('user.username = :username', { username })
      .getCount();
  }

  find_one_by_email(email: string): Promise<UserModel> {
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.email', 'user.username', 'user.password'])
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }

  // if user.author_profile exist then cannot create another author_profile
  // author_check(parameters: { user_id: number }) {
  //   const { user_id } = parameters;
  //   return this._userRepo
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.author_profile', 'author_profile')
  //     .where('user.id = :user_id', { user_id })
  //     .getOne();
  // }

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
