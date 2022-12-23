import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { InviteService } from '../services/invite.service';
import { CreateInviteInput } from '../inputs/create-invite.input';
import { CreateInviteOutput } from '../outputs/create-invite.output';

@Resolver()
export class CreateResolver {
  constructor(
    private _authService: AuthService,
    private _inviteService: InviteService,
  ) {}

  @Mutation(() => CreateInviteOutput)
  @UseGuards(AuthGuard)
  create_invite(
    @Args('parameters') create_input: CreateInviteInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { comment, manga_id, to_author_id } = create_input;

    return this._inviteService.create_invite({
      comment,
      manga_id,
      user_id,
      to_author_id,
    });
  }
}
