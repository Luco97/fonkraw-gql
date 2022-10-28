import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MangaModel } from './manga.model';
import { Repository } from 'typeorm';

@Injectable()
export class MangaModelService {
  constructor(
    @InjectRepository(MangaModel) private _mangaRepo: Repository<MangaModel>,
  ) {}

  find_all(parameters: {}): Promise<[MangaModel[], number]> {
    const {} = parameters;
    return this._mangaRepo
      .createQueryBuilder('manga')
      .leftJoinAndSelect('manga.genres', 'genres')
      .leftJoinAndSelect('manga.authors', 'authors')
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
      .orderBy()
      .take()
      .skip()
      .getManyAndCount();
  }
}
