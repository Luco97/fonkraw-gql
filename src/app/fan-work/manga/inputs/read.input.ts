import { Field, InputType } from '@nestjs/graphql';

import { findAll } from '@utils/find-all.input';

@InputType('read_all_mangas')
export class ReadAllInput extends findAll {
  @Field(() => String, { nullable: true, defaultValue: '' })
  search?: string;
}

@InputType()
export class ReadEditablesInput extends findAll {}

@InputType()
export class ReadFavoritesInput extends findAll {
  @Field(() => String, { nullable: true, defaultValue: '' })
  search?: string;

  @Field(() => String, { nullable: true, defaultValue: '' })
  username?: string;
}

@InputType()
export class ReadOneInput {
  @Field(() => Number)
  manga_id: number;
}

@InputType()
export class ReadRelatedInput {
  @Field(() => Number, { nullable: true })
  author_id: number;

  @Field(() => String)
  author_alias: string;
}
