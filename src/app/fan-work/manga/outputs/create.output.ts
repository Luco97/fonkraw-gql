import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { MangaModel } from '@database/models/manga';

@ObjectType()
export class CreateOutput extends response {
  @Field(() => MangaModel, { nullable: true })
  manga?: MangaModel;
}
