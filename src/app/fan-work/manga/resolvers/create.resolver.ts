import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthGuard } from '@guard/auth.guard';
import { UserDataInterceptor } from '@shared/auth';

import { CreateInput } from '../inputs/create.input';
import { CreateOutput } from '../outputs/create.output';
import { MangaService } from '../services/manga.service';

@Resolver()
export class CreateResolver {
  constructor(private _mangaService: MangaService) {}

  @Mutation(() => CreateOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  create(
    @Args('parameters') createInput: CreateInput,
    @Context() context,
  ): Promise<CreateOutput> {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { cover_url, pages, title } = createInput;

    return this._mangaService.create_manga({
      title,
      pages,
      cover_url,
      creator_user_id: user_id,
    });
  }
}
