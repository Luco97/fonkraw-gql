import { CommentModelService } from '@database/models/comment';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '@shared/auth';

import { Request } from 'express';

import { ReadAllInput } from '../inputs/read.input';
import { ReadAllOutput } from '../outputs/read.output';
import { HttpStatus } from '@nestjs/common';

@Resolver()
export class GetResolver {
  constructor(
    private _authService: AuthService,
    private _commentModel: CommentModelService,
  ) {}

  @Query(() => ReadAllOutput, { name: 'find_all_comments' })
  find_all(
    @Args('options', { nullable: false })
    readInput: ReadAllInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { manga_id, skip, take } = readInput || { skip: 0, take: 5 };

    return new Promise<ReadAllOutput>((resolve, reject) =>
      this._commentModel
        .find_all_from_manga({ manga_id, user_id, skip, take })
        .then(([comments, count]) =>
          resolve({
            count,
            comments,
            status: HttpStatus.OK,
            message: `total comments: ${count}`,
          }),
        ),
    );
  }
}
