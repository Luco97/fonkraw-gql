import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { CommentModelService } from '@database/models/comment';

import { DeleteInput } from '../inputs/delete.input';
import { DeleteOutput } from '../outputs/delete.output';
@Resolver()
export class DeleteResolver {
  constructor(
    private _authService: AuthService,
    private _commentModel: CommentModelService,
  ) {}

  @Mutation(() => DeleteOutput)
  @UseGuards(AuthGuard)
  delete_comment(
    @Args('parameters') deleteInput: DeleteInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { comment_id, user_comment_id } = deleteInput;

    return new Promise<DeleteOutput>((resolve, reject) => {
      if (user_id != user_comment_id)
        resolve({
          message: `you can't delete this comment`,
          status: HttpStatus.UNAUTHORIZED,
        });
      else
        this._commentModel.delete(comment_id).then(() =>
          resolve({
            status: HttpStatus.OK,
            message: `comment with id: ${comment_id} deleted`,
          }),
        );
    });
  }
}
