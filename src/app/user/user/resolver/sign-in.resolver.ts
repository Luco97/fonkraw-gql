import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignInInput } from '../inputs/sign-in.input';
import { UserService } from '../services/user.service';
import { SignInOutput } from '../outputs/sign-in.output';

@Resolver()
export class SignInResolver {
  constructor(private _userService: UserService) {}
  @Mutation(() => SignInOutput)
  sign_in(
    @Args('credentials') user_credential: SignInInput,
  ): Promise<SignInOutput> {
    const { email, password } = user_credential;
    return this._userService.sign_in_user({ email, password });
  }
}
