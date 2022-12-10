import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { UserModelService } from '@database/models/user';
import { MangaModelService } from '@database/models/manga';
import { CommentModelService } from '@database/models/comment';

import { CreateInput } from '../inputs/create.input';
import { CreateOutput } from '../outputs/create.output';

@Resolver()
export class CreateResolver {
  constructor(
    private _authService: AuthService,
    private _userModel: UserModelService,
    private _mangaModel: MangaModelService,
    private _commentModel: CommentModelService,
  ) {}

  @Mutation(() => CreateOutput)
  @UseGuards(AuthGuard)
  create_comment(
    @Args('parameters') createInput: CreateInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const user_id: number = this._authService.userID(token);

    const { comment, manga_id } = createInput;

    return new Promise<CreateOutput>((resolve, reject) =>
      this._mangaModel.check_one(manga_id, true).then((count) => {
        if (!count)
          resolve({
            status: HttpStatus.OK,
            message: `that manga does't exist :(`,
          });
        else
          Promise.all([
            this._commentModel.create({ comment, manga_id, user_id }),
            this._userModel.find_one_by_id(user_id),
          ]).then(([new_comment, user]) =>
            resolve({
              status: HttpStatus.CREATED,
              message: `comment created`,
              comment: {
                ...new_comment,
                user,
              },
            }),
          );
      }),
    );
  }
}
