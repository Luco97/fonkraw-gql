import { Field, InputType } from '@nestjs/graphql';

import { findAll } from '@utils/find-all.input';

@InputType()
export class ReadInput extends findAll {
  @Field(() => String, { nullable: true, defaultValue: '' })
  search?: string;
}

@InputType()
export class ReadEditablesInput extends findAll {}
