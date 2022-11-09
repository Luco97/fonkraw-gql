import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserService } from '../services/user.service';
import { RegisterInput } from '../inputs/register.input';
import { RegisterOutput } from '../outputs/register.output';

@Resolver()
export class RegisterResolver {
  constructor(private _userService: UserService) {}

  @Mutation(() => RegisterOutput)
  register_user(
    @Args('user') create_user: RegisterInput,
  ): Promise<RegisterOutput> {
    const { email, password, username } = create_user;
    return this._userService.create_user({ email, username, password });
  }
}
