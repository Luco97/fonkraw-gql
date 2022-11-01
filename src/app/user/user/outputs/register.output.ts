import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'output object of register_user' })
export class RegisterOutput {
  @Field(() => Number, { description: 'status response' })
  status: number;

  @Field(() => String, { description: 'message for extra info' })
  message: string;
}
