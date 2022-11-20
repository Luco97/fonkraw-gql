import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthGuard } from '@guard/auth.guard';
import { UpdateOutput } from '../outputs/update.output';
import { AuthService } from '@shared/auth';
import { MangaModelService } from '@database/models/manga';
import { AuthorModelService } from '@database/models/author';
import { UpdateStatusInput } from '../inputs/update.input';

@Resolver()
export class UpdateResolver {
  constructor(
    private _authService: AuthService,
    private _mangaModel: MangaModelService,
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

    const { manga_id, status } = parameters;
    const user_id: number = this._authService.userID(token);

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
              message: 'update should  be ok',
              status: HttpStatus.OK,
              extra: JSON.stringify(result),
            }),
          );
      });
    });
  }
}
