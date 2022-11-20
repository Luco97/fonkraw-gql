import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brackets, Repository, UpdateResult } from 'typeorm';

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
      .where(
        new Brackets((qb) =>
          qb
            .where('LOWER(manga.title) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(genres.name) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(authors.alias) = LOWER(:search)', {
              search: `%${search}%`,
            }),
        ),
      )
      .andWhere('manga.active = :status', { status: true })
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

  create(parameters: {
    title: string;
    pages: number;
    cover_url: string;
    author_id: number;
  }): Promise<MangaModel> {
    const { title, pages, cover_url, author_id } = parameters;
    return this._mangaRepo.save(
      this._mangaRepo.create({
        title,
        pages,
        cover_url,
        creator: { id: author_id },
        authors: [{ id: author_id }],
      }),
    );
  }

  update_status(parameters: {
    status: boolean;
    manga_id: number;
  }): Promise<UpdateResult> {
    const { status, manga_id } = parameters;
    return this._mangaRepo.update({ id: manga_id }, { active: status });
  }

  set_genres(
    manga_id: number,
    genres_id: number[],
    drop_genres_id: number[] = [],
  ): Promise<void> {
    const not_repeat_ids: number[] = [...new Set(genres_id)];
    const drop_repeat_ids: number[] = [
      ...new Set([...genres_id, ...drop_genres_id]),
    ];
    return this._mangaRepo
      .createQueryBuilder('manga')
      .relation('genres')
      .comment(
        `set_genres --> manga.id = ${manga_id} & genres.id = ${not_repeat_ids} & drop genres.id = ${drop_repeat_ids}`,
      )
      .of(manga_id)
      .addAndRemove(not_repeat_ids, drop_repeat_ids);
  }

  set_author(manga_id: number, author_id: number): Promise<void> {
    return this._mangaRepo
      .createQueryBuilder('manga')
      .relation('authors')
      .comment(
        `set_author --> manga.id = ${manga_id} & author.id = ${author_id}`,
      )
      .of(manga_id)
      .addAndRemove(author_id, author_id);
  }

  add_favorite(manga_id: number, user_id: number): Promise<void> {
    return this._mangaRepo
      .createQueryBuilder('manga')
      .relation('manga.users')
      .comment(`add_favorite --> manga.id = ${manga_id} & user.id = ${user_id}`)
      .of(manga_id)
      .add(user_id);
  }

  drop_favorite(manga_id: number, user_id: number): Promise<void> {
    return this._mangaRepo
      .createQueryBuilder('manga')
      .relation('manga.users')
      .comment(
        `drop_favorite --> manga.id = ${manga_id} & user.id = ${user_id}`,
      )
      .of(manga_id)
      .remove(user_id);
  }

  find_favorites(parameters: {
    skip: number;
    take: number;
    search: string;
    user_id: number;
    orderProperty: string;
    order: 'ASC' | 'DESC';
  }): Promise<[MangaModel[], number]> {
    const { order, orderProperty, skip, take, search, user_id } = parameters;
    const orderBy: string = `items.${
      ['title', 'pages', 'created_at', 'favorites_user'].includes(orderProperty)
        ? orderProperty
        : 'createdAt'
    }`;
    return this._mangaRepo
      .createQueryBuilder('manga')
      .leftJoin('manga.users', 'users')
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
      .where(
        new Brackets((qb) =>
          qb
            .where('LOWER(manga.title) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(genres.name) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(authors.alias) = LOWER(:search)', {
              search: `%${search}%`,
            }),
        ),
      )
      .andWhere('users.id = :user_id', { user_id })
      .orderBy(orderBy, ['ASC', 'DESC'].includes(order) ? order : 'ASC')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  find_author_manga(parameters: {
    skip: number;
    take: number;
    search: string;
    author_id: number;
    orderProperty: string;
    order: 'ASC' | 'DESC';
  }): Promise<[MangaModel[], number]> {
    const { order, orderProperty, skip, take, search, author_id } = parameters;
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
      .where(
        new Brackets((qb) =>
          qb
            .where('LOWER(manga.title) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(genres.name) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(authors.alias) = LOWER(:search)', {
              search: `%${search}%`,
            }),
        ),
      )
      .andWhere('authors.id = :author_id', { author_id })
      .orderBy(orderBy, ['ASC', 'DESC'].includes(order) ? order : 'ASC')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  find_genre_manga(parameters: {
    skip: number;
    take: number;
    search: string;
    genre_id: number;
    orderProperty: string;
    order: 'ASC' | 'DESC';
  }): Promise<[MangaModel[], number]> {
    const { order, orderProperty, skip, take, search, genre_id } = parameters;
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
      .where(
        new Brackets((qb) =>
          qb
            .where('LOWER(manga.title) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(genres.name) = LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(authors.alias) = LOWER(:search)', {
              search: `%${search}%`,
            }),
        ),
      )
      .andWhere('genres.id = :genre_id', { genre_id })
      .orderBy(orderBy, ['ASC', 'DESC'].includes(order) ? order : 'ASC')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  find_editables(parameters: {
    user_id: number;
    skip: number;
    take: number;
    orderProperty: string;
    order: 'ASC' | 'DESC';
    // manga_id: number;
  }): Promise<[MangaModel[], number]> {
    const { user_id, skip, take, order, orderProperty } = parameters;
    const orderBy: string = `items.${
      ['title', 'pages', 'created_at', 'favorites_user'].includes(orderProperty)
        ? orderProperty
        : 'createdAt'
    }`;

    return this._mangaRepo
      .createQueryBuilder('manga')
      .leftJoin('manga.creator', 'creator')
      .leftJoin('creator.user', 'user')
      .where('user.id = :user_id', { user_id })
      .orderBy(orderBy, ['ASC', 'DESC'].includes(order) ? order : 'ASC')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  find_editable(parameters: {
    user_id: number;
    manga_id: number;
  }): Promise<MangaModel> {
    const { user_id, manga_id } = parameters;
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
      .leftJoin('manga.creator', 'creator')
      .leftJoin('creator.user', 'user')
      .where('user.id = :user_id', { user_id })
      .andWhere('manga.id = :manga_id', { manga_id })
      .getOne();
  }

  // If value = 1 can send invitation
  valid_creator(parameters: {
    user_id: number;
    manga_id: number;
  }): Promise<number> {
    const { user_id, manga_id } = parameters;
    return this._mangaRepo
      .createQueryBuilder('manga')
      .leftJoin('manga.creator', 'creator')
      .leftJoin('creator.user', 'user')
      .where('user.id = :user_id', { user_id })
      .andWhere('manga.id = :manga_id', { manga_id })
      .getCount();
  }

  already_author(parameters: { author_id: number; manga_id: number }) {
    const { manga_id, author_id } = parameters;
    return this._mangaRepo
      .createQueryBuilder('manga')
      .leftJoin('manga.authors', 'authors')
      .where('manga.id = :manga_id', { manga_id })
      .andWhere('authors.id = :author_id', { author_id })
      .getCount();
  }
}
