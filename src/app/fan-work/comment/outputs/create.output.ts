import { CommentModel } from '@database/models/comment';
import { Field, ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('create_comment_output')
export class CreateOutput extends response {
  @Field(() => CommentModel, { nullable: true })
  comment?: CommentModel;
}
