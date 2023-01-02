import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { UpdateOutput } from '../outputs/update.output';
import { MangaModelService } from '@database/models/manga';

@Resolver()
export class DeleteResolver {
  constructor(
    private _mangaModel: MangaModelService,
    private _authService: AuthService,
  ) {}

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  delete(
    @Args('manga_id') manga_id: number,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    return new Promise<UpdateOutput>((resolve, reject) =>
      this._mangaModel.find_editable({ user_id, manga_id }).then((manga) => {
        if (!manga)
          resolve({
            message: `manga with id = ${manga_id} doesn't exist`,
            status: HttpStatus.OK,
          });
        else
          resolve({
            message: `manga soft removed`,
            status: HttpStatus.OK,
          });
      }),
    );
  }
}
