import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { find_all_default } from '@utils/find-all.input';
import { MangaModelService } from '@database/models/manga';

import { ReadInput } from '../inputs/read.input';
import { ReadAllOutput } from '../outputs/read.output';
import { HttpStatus } from '@nestjs/common';

@Resolver()
export class ReadResolver {
  constructor(
    private _authService: AuthService,
    private _mangaModel: MangaModelService,
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
}
