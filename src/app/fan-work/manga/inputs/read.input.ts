import { Field, InputType } from '@nestjs/graphql';
import { findAll } from '@utils/find-all.input';

@InputType()
export class ReadInput extends findAll {}

@InputType()
export class ReadEditablesInput {
  @Field(() => Number, { defaultValue: 0 })
  skip: number;

  @Field(() => Number, { defaultValue: 10 })
  take: number;
}
