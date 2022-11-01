import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, MinLength } from 'class-validator';

@InputType('register_user', {
  description: 'register object for user creation',
})
export class RegisterInput {
  @Field(() => String, { description: 'email for the new user' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'username for the new user' })
  @MinLength(5)
  username: string;

  @Field(() => String, { description: 'password for the user' })
  password: string;
}
