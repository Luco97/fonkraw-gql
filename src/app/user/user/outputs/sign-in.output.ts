import { Field, ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('sign_output', { description: 'output object in sign in mutation' })
export class SignInOutput extends response {
  @Field(() => String, { nullable: true, defaultValue: '' })
  token?: string;
}
