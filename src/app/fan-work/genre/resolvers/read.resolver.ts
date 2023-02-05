import { HttpStatus } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { ReadOutput } from '../outputs/read.output';
import { GenreService } from '../service/genre.service';

@Resolver()
export class ReadResolver {
  constructor(private _genreService: GenreService) {}

  @Query(() => ReadOutput)
  find_all_genres(): Promise<ReadOutput> {
    return this._genreService.find_all();
  }
}
