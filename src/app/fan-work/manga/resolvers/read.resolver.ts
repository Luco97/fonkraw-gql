import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { HttpStatus, UseGuards } from '@nestjs/common';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { find_all_default } from '@utils/find-all.input';
import { MangaModelService } from '@database/models/manga';
import { AuthorModelService } from '@database/models/author';

import { ReadAllOutput, ReadOneOutput } from '../outputs/read.output';
import {
  ReadAllInput,
  ReadEditablesInput,
  ReadOneInput,
  ReadRelatedInput,
} from '../inputs/read.input';

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
    readInput: ReadAllInput,
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

  @Query(() => ReadOneOutput)
  find_one(
    @Args('manga_id') manga_id: number,
    @Context() context,
  ): Promise<ReadOneOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    return new Promise<ReadOneOutput>((resolve, reject) => {
      this._mangaModel
        .find_one({ id: manga_id, user_id })
        .then((manga) =>
          resolve({ manga, message: ``, status: HttpStatus.OK }),
        );
    });
  }

  // Obtener mangas relacionados
  // autor mas favoritos
  // ultimo(s) creado
  // mejor del genero o nose ahi se me ocurrira
  @Query(() => ReadAllOutput)
  related_mangas(
    @Args('parameters', { nullable: false }) readInput: ReadRelatedInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { author_alias, author_id } = readInput;

    return new Promise<ReadAllOutput>((resolve, reject) => {
      this._mangaModel
        .find_relateds({
          take: 2,
          author_alias,
          author_id,
          user_id,
        })
        .then(([mangas, count]) =>
          resolve({
            mangas,
            count,
            message: `best mangas of ${author_alias} found`,
            status: HttpStatus.OK,
          }),
        );
    });
  }
}
