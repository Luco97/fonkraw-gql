import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { UpdateInput } from '../inputs/update.input';
import { UpdateOutput } from '../outputs/update.output';
import { InviteService } from '../services/invite.service';

@Resolver()
export class CheckResolver {
  constructor(
    private _authService: AuthService,
    private _inviteService: InviteService,
  ) {}
  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  update_invite(
    @Args('update_invite') update_invite: UpdateInput,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    const { accept, invite_id } = update_invite;

    return this._inviteService.check_invite({
      accept,
      invite_id,
      to_author_user_id: user_id,
    });
  }
}
