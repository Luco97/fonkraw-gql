import { Field, ObjectType } from '@nestjs/graphql';

import { GenreModel } from '@database/models/genre';
import { response } from '@utils/response.output';

@ObjectType('find_all_genres')
export class ReadOutput extends response {
  @Field(() => [GenreModel])
  genres: GenreModel[];

  @Field(() => Number)
  count: number;
}
