import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { UserDataInterceptor } from '@shared/auth';
import { CreateInput } from '../inputs/create.input';
import { AuthGuard } from '@guard/auth.guard';
import { CreateOutput } from '../outputs/create.output';
import { AuthorService } from '../services/author.service';

@Resolver()
export class CreateResolver {
  constructor(private _authorService: AuthorService) {}

  @Mutation(() => CreateOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  create(
    @Args('author', { nullable: true }) createInput: CreateInput,
    @Context() context,
  ): Promise<CreateOutput> {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { alias, description } = createInput;

    return this._authorService.create({ alias, description, user_id });
  }
}
