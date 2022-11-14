import { AuthorModel } from '@database/models/author';
import { Field } from '@nestjs/graphql';
import { response } from '@utils/response.output';

export class ReadAllOutput extends response {
  @Field(() => [AuthorModel], { nullable: true })
  authors: AuthorModel[];

  @Field(() => Number)
  count: number;
}

export class ReadOneOutput extends response {
  @Field(() => AuthorModel, { nullable: true })
  author: AuthorModel;
}
