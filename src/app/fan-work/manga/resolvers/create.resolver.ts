import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { MangaModelService } from '@database/models/manga';
import { AuthorModelService } from '@database/models/author';

import { CreateInput } from '../inputs/create.input';
import { CreateOutput } from '../outputs/create.output';

@Resolver()
export class CreateResolver {
  constructor(
    private _authService: AuthService,
    private _mangaModel: MangaModelService,
    private _authorModel: AuthorModelService,
  ) {}

  @Mutation(() => CreateOutput)
  @UseGuards(AuthGuard)
  create(
    @Args('parameters') createInput: CreateInput,
    @Context() context,
  ): Promise<CreateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const user_id: number = this._authService.userID(token);

    const { cover_url, pages, title } = createInput;

    return new Promise<CreateOutput>((resolve, reject) => {
      this._authorModel.author_check({ user_id }).then((author) => {
        if (!author)
          resolve({
            status: HttpStatus.OK,
            message: `you can't create a manga, first create author profile`,
          });
        else
          this._mangaModel
            .create({
              title,
              pages,
              cover_url,
              author_id: author.id,
            })
            .then((new_manga) =>
              resolve({
                manga: new_manga,
                message: `manga created`,
                status: HttpStatus.CREATED,
              }),
            );
      });
    });
  }
}
