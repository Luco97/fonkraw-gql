import { HttpStatus, Injectable } from '@nestjs/common';

import { ReadOutput } from '../outputs/read.output';
import { UpdateOutput } from '../outputs/update.output';
import { GenreModelService } from '@database/models/genre';

@Injectable()
export class GenreService {
  constructor(private _genreModel: GenreModelService) {}

  find_all() {
    return new Promise<ReadOutput>((resolve, reject) => {
      this._genreModel.find_all().then(([genres, count]) =>
        resolve({
          genres,
          count,
          status: HttpStatus.OK,
          message: `total genres found: ${count}`,
        }),
      );
    });
  }

  update_description(parameters: {
    genre_id: number;
    new_description: string;
  }): Promise<UpdateOutput> {
    const { genre_id, new_description } = parameters;

    return new Promise<UpdateOutput>((resolve, reject) =>
      this._genreModel.find_one(genre_id).then((genre) => {
        if (!genre)
          resolve({
            message: `genre with id = ${genre_id} not exist`,
            status: HttpStatus.OK,
          });
        else
          this._genreModel.update(genre_id, new_description).then(() =>
            resolve({
              message: `genre with id = ${genre_id} update`,
              status: HttpStatus.OK,
            }),
          );
      }),
    );
  }
}
