import { UseGuards, HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { CreateInput } from '../inputs/create.input';
import { UserModelService } from '@database/models/user';
import { AuthorModel, AuthorModelService } from '@database/models/author';
import { AuthGuard } from '@guard/auth.guard';
import { CreateOutput } from '../outputs/create.output';

@Resolver()
export class CreateResolver {
  constructor(
    private _authService: AuthService,
    private _userModel: UserModelService,
    private _authorModel: AuthorModelService,
  ) {}

  @Mutation(() => CreateOutput)
  @UseGuards(AuthGuard)
  create(
    @Args('author', { nullable: true }) createInput: CreateInput,
    @Context() context,
  ): Promise<CreateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    
    const { alias, description } = createInput;
    const user_id: number = this._authService.userID(token);

    return new Promise<CreateOutput>((resolve, reject) => {
      this._authorModel.author_check({ user_id, alias }).then((author) => {
        if (author)
          resolve({
            author,
            message: 'author already exist',
            status: HttpStatus.AMBIGUOUS,
          });
        else
          this._authorModel
            .create({ alias, description, user_id })
            .then((new_author) =>
              resolve({
                author: new_author,
                message: `Happy to see you, ${new_author.alias}`,
                status: HttpStatus.OK,
              }),
            );
      });
    });
  }
}
