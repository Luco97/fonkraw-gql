import { UseInterceptors } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { UserDataInterceptor } from '@shared/auth';

import { ReadAllInput } from '../inputs/read.input';
import { ReadAllOutput } from '../outputs/read.output';
import { CommentService } from '../services/comment.service';

@Resolver()
export class GetResolver {
  constructor(private _commentService: CommentService) {}

  @Query(() => ReadAllOutput, { name: 'find_all_comments' })
  @UseInterceptors(UserDataInterceptor)
  find_all(
    @Args('options', { nullable: false })
    readInput: ReadAllInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { manga_id, skip, take } = readInput || { skip: 0, take: 5 };

    return this._commentService.find_all({ manga_id, user_id, skip, take });
  }
}
