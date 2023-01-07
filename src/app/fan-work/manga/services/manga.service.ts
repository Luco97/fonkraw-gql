import { HttpStatus, Injectable } from '@nestjs/common';

import { UpdateOutput } from '../outputs/update.output';
import { CreateOutput } from '../outputs/create.output';
import { MangaModelService } from '@database/models/manga';
import { AuthorModelService } from '@database/models/author';

@Injectable()
export class MangaService {
  constructor(
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
              .then((new_manga) =>
                resolve({
                  manga: new_manga,
                  message: `manga created`,
                  status: HttpStatus.CREATED,
                }),
              );
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
}
