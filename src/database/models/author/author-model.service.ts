import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, UpdateResult } from 'typeorm';

import { AuthorModel } from './author.model';

@Injectable()
export class AuthorModelService {
  constructor(
    @InjectRepository(AuthorModel) private _authorRepo: Repository<AuthorModel>,
  ) {}

  find_all(parameters: {
    skip: number;
    take: number;
    alias: string;
    orderProperty: string;
    order: 'ASC' | 'DESC';
  }): Promise<[AuthorModel[], number]> {
    const { order, orderProperty, skip, take, alias } = parameters;
    const orderBy: string = `author.${
      ['alias', 'create_at', 'mangas_count'].includes(orderProperty)
        ? orderProperty
        : 'alias'
    }`;
    return (
      this._authorRepo
        .createQueryBuilder('author')
        // .leftJoin('author.mangas', 'mangas')
        .loadRelationCountAndMap(
          'author.mangas_count',
          'author.mangas',
          'mangos',
          (qb) => qb.orderBy('cnt'),
        )
        // todo: where con LOWER('%nombre%') para buscador de autores
        .where('LOWER(author.alias) like LOWER(:alias)', { alias: `${alias}%` })
        .orderBy(orderBy, ['ASC', 'DESC'].includes(order) ? order : 'ASC')
        .take(take || 10)
        .skip(skip || 0)
        .getManyAndCount()
    );
  }

  find_one(id: number): Promise<AuthorModel> {
    return this._authorRepo
      .createQueryBuilder('author')
      .where('author.id = :id', { id })
      .loadRelationCountAndMap(
        'author.mangas_count',
        'author.mangas',
        'mangos',
        (qb) => qb.orderBy('cnt'),
      )
      .getOne();
  }

  // if user.author_profile not exist
  create(parameters: {
    alias: string;
    user_id: number;
    description: string;
  }): Promise<AuthorModel> {
    const { alias, description, user_id } = parameters;
    return this._authorRepo.save(
      this._authorRepo.create({ alias, description, user: { id: user_id } }),
    );
  }

  //  the same thing on manga
  // already_author(parameters: { author_id: number; manga_id: number }) {
  //   const { manga_id, author_id } = parameters;
  //   return this._authorRepo
  //     .createQueryBuilder('author')
  //     .leftJoin('author.mangas', 'mangas')
  //     .where('mangas.id = :manga_id', { manga_id })
  //     .andWhere('');
  // }

  update(parameters: {
    author_id: number;
    description: string;
  }): Promise<UpdateResult> {
    const { author_id, description } = parameters;
    return this._authorRepo.update({ id: author_id }, { description });
  }

  author_check(parameters: {
    alias?: string;
    user_id: number;
  }): Promise<AuthorModel> {
    const { user_id, alias } = parameters;
    return this._authorRepo
      .createQueryBuilder('author')
      .leftJoin('author.user', 'user')
      .where('user.id = :user_id', { user_id })
      .orWhere('LOWER(author.alias) = LOWER(:alias)', { alias })
      .getOne();
  }

  // Validate if this user can send invitation
  // send_invitation_check(parameters: { user_id: number; manga_id: number }) {
  //   const { user_id, manga_id } = parameters;
  //   this._authorRepo
  //     .createQueryBuilder('author')
  //     .leftJoin('author.user', 'user')
  //     .leftJoin('author.init_mangas', 'init_mangas')
  //     .where('user.id = :user_id', { user_id })
  //     .andWhere('init_mangas = :manga_id', { manga_id })
  //     .getOne();
  // }
}
