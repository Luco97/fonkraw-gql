import { Field, InputType } from '@nestjs/graphql';

@InputType('delete_comment_input')
export class DeleteInput {
  @Field(() => Number)
  user_comment_id: number;

  @Field(() => Number)
  comment_id: number;
}
