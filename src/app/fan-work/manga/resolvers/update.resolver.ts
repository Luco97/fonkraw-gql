import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthGuard } from '@guard/auth.guard';

import { UserDataInterceptor } from '@shared/auth';
import { UpdateOutput } from '../outputs/update.output';
import { MangaService } from '../services/manga.service';
import { UpdateStatusInput, UpdateGenresInput } from '../inputs/update.input';

@Resolver()
export class UpdateResolver {
  constructor(private _mangaService: MangaService) {}

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  update_status(
    @Args('manga_id') parameters: UpdateStatusInput,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { manga_id, status } = parameters;

    return this._mangaService.update_status({ manga_id, status, user_id });
  }

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  update_highlight(
    @Args('manga_id') parameters: UpdateStatusInput,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { manga_id, status } = parameters;

    return this._mangaService.update_highlight({ manga_id, status, user_id });
  }

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  update_genres(
    @Args('parameters') updateInput: UpdateGenresInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { add_genres, manga_id } = updateInput;

    return this._mangaService.update_genres({ add_genres, manga_id, user_id });
  }
}
