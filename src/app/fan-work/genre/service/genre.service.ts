import { GenreModelService } from '@database/models/genre';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateOutput } from '../outputs/update.output';

@Injectable()
export class GenreService {
  constructor(private _genreModel: GenreModelService) {}

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
