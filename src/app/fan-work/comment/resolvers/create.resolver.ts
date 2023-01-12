import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { UserDataInterceptor } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';

import { CreateInput } from '../inputs/create.input';
import { CreateOutput } from '../outputs/create.output';
import { CommentService } from '../services/comment.service';

@Resolver()
export class CreateResolver {
  constructor(private _commentService: CommentService) {}

  @Mutation(() => CreateOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  create_comment(
    @Args('parameters') createInput: CreateInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { comment, manga_id } = createInput;

    return this._commentService.create({ comment, manga_id, user_id });
  }
}
