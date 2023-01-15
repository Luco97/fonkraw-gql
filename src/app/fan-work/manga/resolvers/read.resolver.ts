import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthGuard } from '@guard/auth.guard';
import { find_all_default } from '@utils/find-all.input';
import { UserDataInterceptor } from '@shared/auth';

import {
  ReadAllInput,
  ReadRelatedInput,
  ReadEditablesInput,
  ReadFavoritesInput,
} from '../inputs/read.input';
import { ReadAllOutput, ReadOneOutput } from '../outputs/read.output';

import { MangaService } from '../services/manga.service';

@Resolver()
export class ReadResolver {
  constructor(private _mangaService: MangaService) {}

  @Query(() => ReadAllOutput, { name: 'find_all_manga' })
  @UseInterceptors(UserDataInterceptor)
  find_all(
    @Args('options', {
      nullable: true,
      defaultValue: { search: '', ...find_all_default },
    })
    readInput: ReadAllInput,
    @Context() context,
  ): Promise<ReadAllOutput> {
    const req: Request = context.req;
    // const token: string = req.headers?.authorization;
    // const user_id: number = this._authService.userID(token);
    const user_id: number = +req.header('user_id');

    const { order, orderBy, skip, take, search } = readInput || {
      search: '',
      ...find_all_default,
    };

    return this._mangaService.find_all({
      skip,
      take,
      order,
      search,
      orderBy,
      user_id,
    });
  }

  @Query(() => [ReadAllOutput])
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  find_editables(
    @Args('options', {
      nullable: true,
      defaultValue: find_all_default,
    })
    readInput: ReadEditablesInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { order, orderBy, skip, take } = readInput || find_all_default;
    return this._mangaService.find_editables({
      skip,
      take,
      order,
      orderBy,
      user_id,
    });
  }

  @Query(() => ReadOneOutput)
  @UseInterceptors(UserDataInterceptor)
  find_one(
    @Args('manga_id') manga_id: number,
    @Context() context,
  ): Promise<ReadOneOutput> {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    return this._mangaService.find_one({ manga_id, user_id });
  }

  @Query(() => [ReadAllOutput])
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  find_favorites(
    @Args('options', {
      nullable: true,
      defaultValue: find_all_default,
    })
    readInput: ReadFavoritesInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { order, orderBy, skip, take, search, username } = readInput || {
      ...find_all_default,
      search: '',
      username: '',
    };
    return this._mangaService.find_favorites({
      skip,
      take,
      order,
      orderBy,
      search,
      user_id,
      username,
    });
  }

  // Obtener mangas relacionados
  // autor mas favoritos
  // ultimo(s) creado
  // mejor del genero o nose ahi se me ocurrira
  @Query(() => ReadAllOutput)
  @UseInterceptors(UserDataInterceptor)
  related_mangas(
    @Args('parameters', { nullable: false }) readInput: ReadRelatedInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { author_alias, author_id } = readInput;

    return this._mangaService.related_mangas({
      user_id,
      author_id,
      author_alias,
    });
  }
}
