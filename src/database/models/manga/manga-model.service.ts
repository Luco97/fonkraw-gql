import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MangaModel } from './manga.model';

@Injectable()
export class MangaModelService {
  constructor(
    @InjectRepository(MangaModel) private _mangaRepo: Repository<MangaModel>,
  ) {}

  find_all(parameters: {
    skip: number;
    take: number;
    search: string;
    orderProperty: string;
    order: 'ASC' | 'DESC';
  }): Promise<[MangaModel[], number]> {
    const { order, orderProperty, skip, take, search } = parameters;
    const orderBy: string = `items.${
      ['title', 'pages', 'created_at', 'favorites_user'].includes(orderProperty)
        ? orderProperty
        : 'createdAt'
    }`;
    return this._mangaRepo
      .createQueryBuilder('manga')
      .leftJoinAndSelect('manga.genres', 'genres')
      .loadRelationCountAndMap(
        'genres.mangas_count',
        'genres.mangas',
        'tags',
        (qb) => qb.orderBy('cnt'),
      )
      .leftJoinAndSelect('manga.authors', 'authors')
      .loadRelationCountAndMap(
        'authors.mangas_count',
        'authors.mangas',
        'artists',
        (qb) => qb.orderBy('cnt'),
      )
      .leftJoinAndSelect('manga.language', 'language')
      .loadRelationCountAndMap(
        'manga.favorites_user',
        'manga.users',
        'favorites',
        (qb) => qb.orderBy('cnt'),
      )
      .loadRelationCountAndMap(
        'manga.commentaries',
        'manga.comments',
        'commentarious',
        (qb) => qb.orderBy('cnt'),
      )
      .where('LOWER(manga.title) = LOWER(:search)', { search: `%${search}%` })
      .orWhere('LOWER(genres.name) = LOWER(:search)', { search: `%${search}%` })
      .orWhere('LOWER(authors.alias) = LOWER(:search)', {
        search: `%${search}%`,
      })
      .orderBy(orderBy, ['ASC', 'DESC'].includes(order) ? order : 'ASC')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  find_one(id: number): Promise<MangaModel> {
    return this._mangaRepo
      .createQueryBuilder('manga')
      .leftJoinAndSelect('manga.genres', 'genres')
      .loadRelationCountAndMap(
        'genres.mangas_count',
        'genres.mangas',
        'tags',
        (qb) => qb.orderBy('cnt'),
      )
      .leftJoinAndSelect('manga.authors', 'authors')
      .loadRelationCountAndMap(
        'authors.mangas_count',
        'authors.mangas',
        'artists',
        (qb) => qb.orderBy('cnt'),
      )
      .leftJoinAndSelect('manga.language', 'language')
      .loadRelationCountAndMap(
        'manga.favorites_user',
        'manga.users',
        'favorites',
        (qb) => qb.orderBy('cnt'),
      )
      .loadRelationCountAndMap(
        'manga.commentaries',
        'manga.comments',
        'commentarious',
        (qb) => qb.orderBy('cnt'),
      )
      .where('manga.id = :id', { id })
      .getOne();
  }
}
