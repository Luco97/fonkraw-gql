import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthGuard } from '@guard/auth.guard';
import { response } from '@utils/response.output';
import { UserDataInterceptor } from '@shared/auth';
import { UpdateInput } from '../inputs/update.input';
import { AuthorService } from '../services/author.service';

@Resolver()
export class UpdateResolver {
  constructor(private _authorService: AuthorService) {}

  @Mutation(() => response)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  update(
    @Args('author', { nullable: true }) updateInput: UpdateInput,
    @Context() context,
  ): Promise<response> {
    const req: Request = context.req;
    // const token: string = req.headers?.authorization;

    const { description } = updateInput;
    // const user_id: number = this._authService.userID(token);
    const user_id: number = +req.header('user_id');

    return this._authorService.update_info({ description, user_id });
  }
}
