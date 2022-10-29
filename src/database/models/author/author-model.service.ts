import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AuthorModel } from './author.model';

@Injectable()
export class AuthorModelService {
  constructor(
    @InjectRepository(AuthorModel) private _authorRepo: Repository<AuthorModel>,
  ) {}

  find_all(parameters: {
    skip: number;
    take: number;
    orderProperty: string;
    order: 'ASC' | 'DESC';
  }): Promise<[AuthorModel[], number]> {
    const { order, orderProperty, skip, take } = parameters;
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

  create(parameters: {
    alias: string;
    description: string;
  }): Promise<AuthorModel> {
    const { alias, description } = parameters;
    return this._authorRepo.save(
      this._authorRepo.create({ alias, description }),
    );
  }
}
