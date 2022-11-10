import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { UpdateInput } from '../inputs/update.input';
import { UserService } from '../services/user.service';
import { UpdateOutput } from '../outputs/update.output';

@Resolver()
export class UpdateResolver {
  constructor(
    private _userService: UserService,
    private _authService: AuthService,
  ) {}

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  update_user_info(
    @Args() updateInfo: UpdateInput,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const { description, image_url } = updateInfo;
    const user_id: number = this._authService.userID(token);

    return this._userService.update_info({ description, image_url, user_id });
  }
}
