import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { CommentModel } from '@database/models/comment';

@ObjectType('read_all_comment_output')
export class ReadAllOutput extends response {
  @Field(() => [CommentModel])
  comments: CommentModel[];

  @Field(() => Number)
  count: number;
}
