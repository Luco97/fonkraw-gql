import { HttpStatus } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GenreModelService } from '@database/models/genre';
import { ReadOutput } from '../outputs/read.output';

@Resolver()
export class ReadResolver {
  constructor(private _genreModel: GenreModelService) {}

  @Query(() => ReadOutput)
  find_all_genres(): Promise<ReadOutput> {
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
}
