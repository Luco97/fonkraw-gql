import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { MangaModelService } from '@database/models/manga';
import { GenreModelService } from '@database/models/genre';

import { UpdateOutput } from '../outputs/update.output';
import { UpdateStatusInput, UpdateGenresInput } from '../inputs/update.input';

@Resolver()
export class UpdateResolver {
  constructor(
    private _authService: AuthService,
    private _mangaModel: MangaModelService,
    private _genreModel: GenreModelService,
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
  update_highlight(
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
