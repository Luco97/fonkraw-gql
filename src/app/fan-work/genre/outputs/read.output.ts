import { GenreModel } from '@database/models/genre';
import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';

ObjectType();
export class ReadOutput extends response {
  @Field(() => [GenreModel])
  genres: GenreModel[];

  @Field(() => Number)
  count: number;
}
