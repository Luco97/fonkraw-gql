import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { CreateInput } from '../inputs/create.input';
import { UserModelService } from '@database/models/user';
import { AuthorModel, AuthorModelService } from '@database/models/author';

@Resolver()
export class CreateResolver {
  constructor(
    private _authService: AuthService,
    private _userModel: UserModelService,
    private _authorModel: AuthorModelService,
  ) {}

  @Mutation(() => AuthorModel)
  create(
    @Args('author', { nullable: true }) createInput: CreateInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const {} = createInput;
    const id_user: number = this._authService.userID(token);
  }
}
