import { Field, ObjectType } from '@nestjs/graphql';

import { RegisterOutput } from './register.output';

@ObjectType({ description: 'output object in sign in mutation' })
export class SignInOutput extends RegisterOutput {
  @Field(() => String, { nullable: true, defaultValue: '' })
  token?: string;
}
