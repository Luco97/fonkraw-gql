import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { AuthorModel } from '@database/models/author';

@ObjectType('read_all_authors')
export class ReadAllOutput extends response {
  @Field(() => [AuthorModel], { nullable: true })
  authors: AuthorModel[];

  @Field(() => Number)
  count: number;
}
@ObjectType('read_one_author_output')
export class ReadOneOutput extends response {
  @Field(() => AuthorModel, { nullable: true })
  author: AuthorModel;
}
