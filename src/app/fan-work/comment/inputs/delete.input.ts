import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteInput {
  @Field(() => Number)
  user_comment_id: number;

  @Field(() => Number)
  comment_id: number;
}
