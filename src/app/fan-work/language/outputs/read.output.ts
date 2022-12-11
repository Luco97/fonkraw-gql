import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { LanguageModel } from '@database/models/language';

@ObjectType('read_all_languages')
export class ReadOutput extends response {
  @Field(() => [LanguageModel])
  languages: LanguageModel[];

  @Field(() => Number)
  count: number;
}
