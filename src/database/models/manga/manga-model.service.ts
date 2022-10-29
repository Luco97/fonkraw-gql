import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MangaModel } from './manga.model';
import { Repository } from 'typeorm';

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
      .where('manga.title = :search', { search: `%${search}%` })
      .orWhere('genres.name = :search', { search: `%${search}%` })
      .orWhere('authors.alias = :search', { search: `%${search}%` })
      .orderBy(orderBy, ['ASC', 'DESC'].includes(order) ? order : 'ASC')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }
}
