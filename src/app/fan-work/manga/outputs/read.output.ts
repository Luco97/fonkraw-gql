import { MangaModel } from '@database/models/manga';
import { Field, ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('read_all_manga')
export class ReadAllOutput extends response {
  @Field(() => [MangaModel], { defaultValue: [] })
  mangas: MangaModel[];

  @Field(() => Number)
  count: number;
}

@ObjectType('read_one_manga')
export class ReadOneOutput extends response {
  @Field(() => MangaModel)
  manga: MangaModel;
}
