import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { MangaModel } from '@database/models/manga';

@ObjectType('create_manga_output')
export class CreateOutput extends response {
  @Field(() => MangaModel, { nullable: true })
  manga?: MangaModel;
}
