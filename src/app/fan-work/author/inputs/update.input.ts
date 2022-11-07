import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateInput {
  @Field(() => String)
  description: string;
}
