import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService, UserDataInterceptor } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { InviteService } from '../services/invite.service';
import { CreateInviteInput } from '../inputs/create-invite.input';
import { CreateInviteOutput } from '../outputs/create-invite.output';

@Resolver()
export class CreateResolver {
  constructor(private _inviteService: InviteService) {}

  @Mutation(() => CreateInviteOutput)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserDataInterceptor)
  create_invite(
    @Args('parameters') create_input: CreateInviteInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const user_id: number = +req.header('user_id');

    const { comment, manga_id, to_author_id } = create_input;

    return this._inviteService.create_invite({
      comment,
      manga_id,
      to_author_id,
      from_author_user_id: user_id,
    });
  }
}
