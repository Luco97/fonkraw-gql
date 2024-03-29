import { HttpStatus, Injectable } from '@nestjs/common';

import { UpdateOutput } from '../outputs/update.output';
import { CreateOutput } from '../outputs/create.output';
import { UserModelService } from '@database/models/user';
import { GenreModelService } from '@database/models/genre';
import { MangaModelService } from '@database/models/manga';
import { AuthorModelService } from '@database/models/author';
import { ReadAllOutput, ReadOneOutput } from '../outputs/read.output';

@Injectable()
export class MangaService {
  constructor(
    private _userModel: UserModelService,
    private _genreModel: GenreModelService,
    private _mangaModel: MangaModelService,
    private _authorModel: AuthorModelService,
  ) {}

  create_manga(parameters: {
    title: string;
    pages: number;
    cover_url: string;
    creator_user_id: number;
  }): Promise<CreateOutput> {
    const { cover_url, pages, title, creator_user_id } = parameters;

    return new Promise<CreateOutput>((resolve, reject) => {
      this._authorModel
        .author_check({ user_id: creator_user_id })
        .then((author) => {
          if (!author)
            resolve({
              status: HttpStatus.OK,
              message: `you can't create a manga, first create author profile`,
            });
          else
            this._mangaModel
              .create({
                title,
                pages,
                cover_url,
                author_id: author.id,
              })
              .then((new_manga) => {
                new_manga.authors = [author];
                resolve({
                  manga: new_manga,
                  message: `manga created`,
                  status: HttpStatus.CREATED,
                });
              });
        });
    });
  }

  delete_manga(parameters: {
    user_id: number;
    manga_id: number;
  }): Promise<UpdateOutput> {
    const { manga_id, user_id } = parameters;
    return new Promise<UpdateOutput>((resolve, reject) =>
      this._mangaModel.find_editable({ user_id, manga_id }).then((manga) => {
        if (!manga)
          resolve({
            message: `manga with id = ${manga_id} doesn't exist`,
            status: HttpStatus.OK,
          });
        else
          resolve({
            message: `manga soft removed`,
            status: HttpStatus.OK,
          });
      }),
    );
  }

  find_all(parameters: {
    order: 'ASC' | 'DESC';
    orderBy: string;
    skip: number;
    take: number;
    search: string;
    user_id: number;
  }): Promise<ReadAllOutput> {
    const { order, orderBy, search, skip, take, user_id } = parameters;

    return new Promise<ReadAllOutput>((resolve, reject) =>
      this._mangaModel
        .find_all({
          skip,
          take,
          order,
          orderProperty: orderBy,
          search,
          user_id,
        })
        .then(([mangas, count]) =>
          resolve({
            count,
            mangas,
            message: `total mangas found: ${count}`,
            status: HttpStatus.OK,
          }),
        ),
    );
  }

  find_one(parameters: {
    manga_id: number;
    user_id: number;
  }): Promise<ReadOneOutput> {
    const { manga_id, user_id } = parameters;

    return new Promise<ReadOneOutput>((resolve, reject) => {
      this._mangaModel
        .find_one({ id: manga_id, user_id })
        .then((manga) =>
          resolve({ manga, message: ``, status: HttpStatus.OK }),
        );
    });
  }

  find_editables(parameters: {
    skip: number;
    take: number;
    order: 'ASC' | 'DESC';
    orderBy: string;
    user_id: number;
  }): Promise<ReadAllOutput> {
    const { order, orderBy, skip, take, user_id } = parameters;

    return new Promise<ReadAllOutput>((resolve, reject) =>
      Promise.all([
        this._mangaModel.find_editables({
          skip,
          take,
          order,
          orderProperty: orderBy,
          user_id,
        }),
        this._authorModel.author_check({ user_id }),
      ]).then(([[mangas, count], author]) => {
        if (!author)
          resolve({
            mangas,
            count,
            message: `you havent an author associate`,
            status: HttpStatus.OK,
          });
        else
          resolve({
            mangas,
            count,
            message: `total mangas created by ${author.alias}: ${count}`,
            status: HttpStatus.OK,
          });
      }),
    );
  }

  // user with username need to exist
  find_favorites(parameters: {
    skip: number;
    take: number;
    orderBy: string;
    order: 'ASC' | 'DESC';
    search: string;
    user_id: number;
    username: string;
  }): Promise<ReadAllOutput> {
    const { order, orderBy, search, skip, take, user_id, username } =
      parameters;

    return new Promise<ReadAllOutput>((resolve, reject) => {
      if (!username)
        this._mangaModel
          .find_favorites({
            skip,
            take,
            order,
            orderProperty: orderBy,
            search,
            user_id, // wich of those are user_id favorites
            username, // actual favorite mangas
          })
          .then(([mangas, count]) =>
            resolve({ count, mangas, status: HttpStatus.OK, message: `` }),
          );
      else
        this._userModel.find_one({ username, email: '' }).then((count) => {
          if (!count)
            resolve({
              count: 0,
              mangas: [],
              status: HttpStatus.NOT_FOUND,
              message: ``,
            });
          else
            this._mangaModel
              .find_favorites({
                skip,
                take,
                order,
                orderProperty: orderBy,
                search,
                user_id, // wich of those are user_id favorites
                username, // actual favorite mangas
              })
              .then(([mangas, count]) =>
                resolve({ count, mangas, status: HttpStatus.OK, message: `` }),
              );
        });
    });
  }

  related_mangas(parameters: {
    user_id: number;
    author_id: number;
    author_alias: string;
  }): Promise<ReadAllOutput> {
    const { author_alias, author_id, user_id } = parameters;

    return new Promise<ReadAllOutput>((resolve, reject) => {
      this._mangaModel
        .find_relateds({
          take: 2,
          author_alias,
          author_id,
          user_id,
        })
        .then(([mangas, count]) =>
          resolve({
            mangas,
            count,
            message: `best mangas of ${author_alias} found`,
            status: HttpStatus.OK,
          }),
        );
    });
  }

  update_status(parameters: {
    manga_id: number;
    status: boolean;
    user_id: number;
  }): Promise<UpdateOutput> {
    const { manga_id, status, user_id } = parameters;

    return new Promise<UpdateOutput>((resolve, reject) => {
      this._mangaModel.find_editable({ manga_id, user_id }).then((manga) => {
        if (!manga)
          resolve({
            message: `can't edit manga with id = ${manga_id}, you aren't the creator`,
            status: HttpStatus.OK,
          });
        else
          this._mangaModel.update_status({ manga_id, status }).then((result) =>
            resolve({
              message: 'update should be ok',
              status: HttpStatus.OK,
              extra: JSON.stringify(result),
            }),
          );
      });
    });
  }

  update_highlight(parameters: {
    manga_id: number;
    status: boolean;
    user_id: number;
  }): Promise<UpdateOutput> {
    const { manga_id, status, user_id } = parameters;

    return new Promise<UpdateOutput>((resolve, reject) => {
      this._mangaModel.find_editable({ manga_id, user_id }).then((manga) => {
        if (!manga)
          resolve({
            message: `can't edit manga with id = ${manga_id}, you aren't the creator`,
            status: HttpStatus.OK,
          });
        else
          this._mangaModel
            .update_highlight({ manga_id, status })
            .then((result) =>
              resolve({
                message: 'update should be ok',
                status: HttpStatus.OK,
                extra: JSON.stringify(result),
              }),
            );
      });
    });
  }

  update_genres(parameters: {
    add_genres: number[];
    manga_id: number;
    user_id: number;
  }) {
    const { add_genres, manga_id, user_id } = parameters;

    return new Promise<UpdateOutput>((resolve, reject) => {
      this._mangaModel.find_editable({ manga_id, user_id }).then((manga) => {
        if (!manga) resolve({ message: ``, status: HttpStatus.OK });
        else {
          // get genres that exists with those ids
          this._genreModel
            .find_many_by_id([...new Set(add_genres)])
            .then((new_genres) => {
              let new_genres_ids: number[] = new_genres.map<number>(
                (element) => element.id,
              );
              // Actual genres with the manga
              let drop_genres_ids: number[] = manga.genres.map<number>(
                (element) => element.id,
              );
              this._mangaModel
                .set_genres(manga.id, new_genres_ids, drop_genres_ids)
                .then(() =>
                  resolve({
                    message: `new genres setted in manga with id = ${manga.id}`,
                    status: HttpStatus.OK,
                  }),
                );
            });
        }
      });
    });
  }
}
