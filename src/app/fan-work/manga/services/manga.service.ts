import { HttpStatus, Injectable } from '@nestjs/common';

import { MangaModelService } from '@database/models/manga';
import { AuthorModelService } from '@database/models/author';
import { UpdateOutput } from '../outputs/update.output';

@Injectable()
export class MangaService {
  constructor(
    private _mangaModel: MangaModelService,
    private _authorModel: AuthorModelService,
  ) {}

  delete_manga(parameters: { user_id: number; manga_id: number }) {
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
