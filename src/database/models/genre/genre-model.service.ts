import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreModel } from './genre.model';
import { Repository } from 'typeorm';

@Injectable()
export class GenreModelService {
  constructor(
    @InjectRepository(GenreModel) private _genreRepo: Repository<GenreModel>,
  ) {}

  find_all(): Promise<[GenreModel[], number]> {
    return this._genreRepo
      .createQueryBuilder('genre')
      .loadRelationCountAndMap('genre.count', 'genre.mangas', 'mango', (qb) =>
        qb.orderBy('cnt'),
      )
      .getManyAndCount();
  }

  find_one(id: number): Promise<GenreModel> {
    return this._genreRepo
      .createQueryBuilder('genre')
      .where('genre.id = :id', { id })
      .loadRelationCountAndMap('genre.count', 'genre.mangas', 'mango', (qb) =>
        qb.orderBy('cnt'),
      )
      .getOne();
  }

  find_many_by_id(genres_id: number[]): Promise<GenreModel[]> {
    return this._genreRepo
      .createQueryBuilder('genre')
      .where('genre.id IN (:...genres_id)', { genres_id })
      .getMany();
  }
}
