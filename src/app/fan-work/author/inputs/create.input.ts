import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInput {
  @Field(() => String)
  alias: string;

  @Field(() => String, { nullable: true, defaultValue: '' })
  description: string;
}
