import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { response } from '@utils/response.output';
import { UserModelService } from '@database/models/user';
import { AuthorModelService } from '@database/models/author';
import { UpdateInput } from '../inputs/update.input';

@Resolver()
export class UpdateResolver {
  constructor(
    private _authService: AuthService,
    private _userModel: UserModelService,
    private _authorModel: AuthorModelService,
  ) {}

  @Mutation(() => response)
  @UseGuards(AuthGuard)
  update(
    @Args('author', { nullable: true }) updateInput: UpdateInput,
    @Context() context,
  ): Promise<response> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const { description } = updateInput;
    const user_id: number = this._authService.userID(token);

    return new Promise<response>((resolve, reject) => {
      this._authorModel.author_check({ user_id }).then((author) => {
        if (!author)
          resolve({
            message: 'author not found',
            status: HttpStatus.NOT_FOUND,
          });
        else
          this._authorModel
            .update({ author_id: author.id, description })
            .then(() =>
              resolve({
                message: 'description updated',
                status: HttpStatus.ACCEPTED,
              }),
            );
      });
    });
  }
}
