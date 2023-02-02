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

  update_user_role(parameters: {
    user_id: number;
    uuid: string;
  }): Promise<UserModel> {
    const { user_id, uuid } = parameters;
    return this._userRepo.save({ id: user_id, role: { uuid } });
  }

  find_all(parameters: {
    take: number;
    skip: number;
    name: string;
  }): Promise<[UserModel[], number]> {
    const { name, skip, take } = parameters;

    return this._userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.activation', 'activation')
      .leftJoinAndSelect('user.author_profile', 'author_profile')
      .where('LOWER(user.username) like :name', {
        name: `${name.toLocaleLowerCase()}%`,
      })
      .take(take || 10)
      .skip(skip || 0)
      .orderBy('user.username', 'ASC')
      .getManyAndCount();
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
      .select(['user.id', 'user.email', 'user.username', 'user.password'])
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.author_profile', 'author_profile')
      .where('user.email = :email', { email })
      .getOne();
  }

  find_one_by_id(id: number): Promise<UserModel> {
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.email', 'user.username', 'user.password'])
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
  }

  // if user.author_profile exist then cannot create another author_profile
  author_check(parameters: { author_id: number }): Promise<UserModel> {
    const { author_id } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.email'])
      .leftJoinAndSelect('user.author_profile', 'author_profile')
      .where('author_profile.id = :author_id', { author_id })
      .getOne();
  }

  // Manga features
  manga_creator(parameters: {
    user_id: number;
    manga_id: number;
  }): Promise<UserModel> {
    const { user_id, manga_id } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.author_profile', 'author_profile')
      .leftJoin('author_profile.init_mangas', 'init_mangas')
      .where('init_mangas.id = :manga_id', { manga_id })
      .andWhere('user.id = :user_id', { user_id })
      .getOne();
  }

  // Invite feature
  // Valid user to send invitation, if return value > 0
  invite_creator(parameters: {
    user_id: number;
    manga_id: number;
  }): Promise<number> {
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
