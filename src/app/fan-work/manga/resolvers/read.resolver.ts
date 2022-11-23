import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { HttpStatus, UseGuards } from '@nestjs/common';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { find_all_default } from '@utils/find-all.input';
import { MangaModelService } from '@database/models/manga';
import { AuthorModelService } from '@database/models/author';

import { ReadAllOutput } from '../outputs/read.output';
import { ReadInput, ReadEditablesInput } from '../inputs/read.input';

@Resolver()
export class ReadResolver {
  constructor(
    private _authService: AuthService,
    private _mangaModel: MangaModelService,
    private _authorModel: AuthorModelService,
  ) {}

  @Query(() => ReadAllOutput, { name: 'find_all_manga' })
  find_all(
    @Args('options', {
      nullable: true,
      defaultValue: { search: '', ...find_all_default },
    })
    readInput: ReadInput,
    @Context() context,
  ): Promise<ReadAllOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { order, orderBy, skip, take, search } = readInput || {
      search: '',
      ...find_all_default,
    };

    return new Promise<ReadAllOutput>((resolve, reject) =>
      this._mangaModel
        .find_all({
          skip,
          take,
          order,
          orderProperty: orderBy,
          search,
          user_id,
        })
        .then(([mangas, count]) =>
          resolve({
            count,
            mangas,
            message: `total mangas found: ${count}`,
            status: HttpStatus.OK,
          }),
        ),
    );
  }

  @Query(() => [ReadAllOutput])
  @UseGuards(AuthGuard)
  find_editables(
    @Args('options', {
      nullable: true,
      defaultValue: find_all_default,
    })
    readInput: ReadEditablesInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { order, orderBy, skip, take } = readInput || find_all_default;
    return new Promise<ReadAllOutput>((resolve, reject) =>
      Promise.all([
        this._mangaModel.find_editables({
          skip,
          take,
          order,
          orderProperty: orderBy,
          user_id,
        }),
        this._authorModel.author_check({ user_id }),
      ]).then(([[mangas, count], author]) => {
        if (!author)
          resolve({
            mangas,
            count,
            message: `you havent an author associate`,
            status: HttpStatus.OK,
          });
        else
          resolve({
            mangas,
            count,
            message: `total mangas created by ${author.alias}: ${count}`,
            status: HttpStatus.OK,
          });
      }),
    );
  }
}
