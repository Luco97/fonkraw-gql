import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { MangaModelService } from '@database/models/manga';
import { GenreModelService } from '@database/models/genre';
import { AuthorModelService } from '@database/models/author';

import { UpdateOutput } from '../outputs/update.output';
import { UpdateStatusInput, UpdateGenresInput } from '../inputs/update.input';

@Resolver()
export class UpdateResolver {
  constructor(
    private _authService: AuthService,
    private _mangaModel: MangaModelService,
    private _genreModel: GenreModelService,
    private _authorModel: AuthorModelService,
  ) {}

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  update_status(
    @Args('manga_id') parameters: UpdateStatusInput,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { manga_id, status } = parameters;

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

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  update_genres(
    @Args('parameters') updateInput: UpdateGenresInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { add_genres, manga_id } = updateInput;

    return new Promise<UpdateOutput>((resolve, reject) => {
      this._mangaModel.find_editable({ manga_id, user_id }).then((manga) => {
        if (!manga) resolve({ message: ``, status: HttpStatus.OK });
        else {
          let add_genres_ids: number[] = add_genres.map<number>(
            (element) => element.id,
          );
          this._genreModel
            .find_many_by_id(add_genres_ids)
            .then((new_genres) => {
              let new_genres_ids: number[] = new_genres.map<number>(
                (element) => element.id,
              );
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
