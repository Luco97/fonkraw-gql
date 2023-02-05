import { UseGuards, SetMetadata } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RoleGuard } from '@guard/role.guard';
import { UpdateInput } from '../inputs/update.input';
import { UpdateOutput } from '../outputs/update.output';
import { GenreService } from '../service/genre.service';

@Resolver()
export class UpdateResolver {
  constructor(private _genreService: GenreService) {}

  @Mutation(() => UpdateOutput)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  update_genre_description(
    @Args('params') updateInput: UpdateInput,
  ): Promise<UpdateOutput> {
    const { genre_id, new_description } = updateInput;

    return this._genreService.update_description({ genre_id, new_description });
  }
}
