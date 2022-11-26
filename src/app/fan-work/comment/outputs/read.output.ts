import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { CommentModel } from '@database/models/comment';

@ObjectType()
export class ReadAllOutput extends response {
  @Field(() => [CommentModel])
  comments: CommentModel[];

  @Field(() => Number)
  count: number;
}
