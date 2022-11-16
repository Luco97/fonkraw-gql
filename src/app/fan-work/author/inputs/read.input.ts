import { Field, InputType } from '@nestjs/graphql';
import { findAll } from '@utils/find-all.input';

@InputType('find_all_authors', { description: 'find all authors options' })
export class ReadInput extends findAll {
  @Field(() => String, { nullable: true, defaultValue: '' })
  alias?: string;
}
