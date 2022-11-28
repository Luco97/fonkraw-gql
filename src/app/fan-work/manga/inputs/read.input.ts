import { Field, InputType } from '@nestjs/graphql';

import { findAll } from '@utils/find-all.input';

@InputType()
export class ReadAllInput extends findAll {
  @Field(() => String, { nullable: true, defaultValue: '' })
  search?: string;
}

@InputType()
export class ReadEditablesInput extends findAll {}

@InputType()
export class ReadOneInput {
  @Field(() => Number)
  manga_id: number;
}
