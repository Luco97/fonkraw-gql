import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { AuthorModel } from '@database/models/author';

@ObjectType('create_author_output')
export class CreateOutput extends response {
  @Field(() => AuthorModel)
  author: AuthorModel;
}
