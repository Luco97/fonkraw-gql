import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @Field(() => String, { description: 'password for the user' })
  @MinLength(7)
  password: string;
}
