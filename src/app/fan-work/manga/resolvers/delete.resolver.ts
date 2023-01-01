import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '@guard/auth.guard';
import { UpdateOutput } from '../outputs/update.output';
import { MangaModelService } from '@database/models/manga';
import { Request } from 'express';
import { AuthService } from '@shared/auth';

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
      this._mangaModel.find_editable({ user_id, manga_id }),
    );
  }
}
