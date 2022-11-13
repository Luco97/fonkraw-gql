import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@shared/auth';
import { AuthGuard } from '@guard/auth.guard';
import { UpdateInput } from '../inputs/update.input';
import { UserService } from '../services/user.service';
import { UpdateOutput } from '../outputs/update.output';
import { RegisterOutput } from '../outputs/register.output';
import { UpdatePasswordInput } from '../inputs/update-password.input';

@Resolver()
export class UpdateResolver {
  constructor(
    private _userService: UserService,
    private _authService: AuthService,
  ) {}

  @Mutation(() => UpdateOutput)
  @UseGuards(AuthGuard)
  update_user_info(
    @Args('update_info') updateInfo: UpdateInput,
    @Context() context,
  ): Promise<UpdateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const { description, image_url } = updateInfo;
    const user_id: number = this._authService.userID(token);

    return this._userService.update_info({ description, image_url, user_id });
  }

  // pass change
  // First step (guard guest)
  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  confirm_password(
    @Args('update_pass') updatePass: UpdatePasswordInput,
    @Context() context,
  ): Promise<boolean> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const { password } = updatePass;
    const user_id: number = this._authService.userID(token);

    return this._userService.confirm_pass({ user_id, password });
  }

  // Second step
  @Mutation(() => RegisterOutput)
  @UseGuards(AuthGuard)
  update_password(
    @Args('update_pass') updatePass: UpdatePasswordInput,
    @Context() context,
  ) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const { password } = updatePass;
    const user_id: number = this._authService.userID(token);

    return this._userService.update_pass({ user_id, password });
  }
}
