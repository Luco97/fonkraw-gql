import { Field, InputType } from '@nestjs/graphql';

@InputType('update_author_description')
export class UpdateInput {
  @Field(() => String)
  description: string;
}
