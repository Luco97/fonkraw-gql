import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { AuthorModel } from '@database/models/author';

@ObjectType()
export class ReadAllOutput extends response {
  @Field(() => [AuthorModel], { nullable: true })
  authors: AuthorModel[];

  @Field(() => Number)
  count: number;
}
@ObjectType()
export class ReadOneOutput extends response {
  @Field(() => AuthorModel, { nullable: true })
  author: AuthorModel;
}
