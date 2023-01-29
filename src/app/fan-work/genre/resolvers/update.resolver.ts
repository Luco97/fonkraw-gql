import { GenreModelService } from '@database/models/genre';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards, HttpStatus, SetMetadata } from '@nestjs/common';
import { UpdateInput } from '../inputs/update.input';
import { UpdateOutput } from '../outputs/update.output';
import { RoleGuard } from '@guard/role.guard';

@Resolver()
export class UpdateResolver {
  constructor(private _genreModel: GenreModelService) {}

  @Mutation(() => UpdateOutput)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  update_genre_description(
    @Args('params') updateInput: UpdateInput,
  ): Promise<UpdateOutput> {
    const { genre_id, new_description } = updateInput;

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
