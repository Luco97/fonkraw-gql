import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { UserDataInterceptor } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';

import { DeleteOutput } from '../outputs/delete.output';
import { CommentService } from '../services/comment.service';
@Resolver()
export class DeleteResolver {
  constructor(private _commentService: CommentService) {}

  @Mutation(() => DeleteOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  delete_comment(
    @Args('parameters', { nullable: false }) comment_id: number,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    return this._commentService.delete({ comment_id, user_id });
  }
}
