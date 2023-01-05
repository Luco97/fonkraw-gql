import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthGuard } from '@guard/auth.guard';
import { UserDataInterceptor } from '@shared/auth';
import { UpdateOutput } from '../outputs/update.output';
import { MangaService } from '../services/manga.service';

@Resolver()
export class DeleteResolver {
  constructor(private _mangaService: MangaService) {}

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  delete(
    @Args('manga_id') manga_id: number,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    return this._mangaService.delete_manga({ manga_id, user_id });
  }
}
