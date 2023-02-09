import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { AuthorModel } from '@database/models/author';

@ObjectType('update_author_output')
export class UpdateOutput extends response {
  @Field(() => AuthorModel)
  author: AuthorModel;
}
