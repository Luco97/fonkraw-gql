import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { GetAllOutput } from '../outputs/get-all.output';
import { InviteService } from '../services/invite.service';

@Resolver()
export class GetResolver {
  constructor(
    private _authService: AuthService,
    private _inviteService: InviteService,
  ) {}

  @Query(() => GetAllOutput)
  @UseGuards(AuthGuard)
  get_all_invites(@Context() context): Promise<GetAllOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    return this._inviteService.get_all_invites(user_id);
  }

  @Mutation(() => GetAllOutput)
  @UseGuards(AuthGuard)
  invites_from_manga(
    @Args('manga_id') manga_id: number,
    @Context() context,
  ): Promise<GetAllOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const user_id: number = this._authService.userID(token);

    return this._inviteService.all_invite_manga({ manga_id, user_id });
  }
}
