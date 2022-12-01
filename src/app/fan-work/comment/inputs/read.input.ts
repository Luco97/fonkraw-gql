import { Field, InputType } from '@nestjs/graphql';

@InputType('read_all_comments')
export class ReadAllInput {
  @Field(() => Number)
  manga_id: number;

  @Field(() => Number, { defaultValue: 5 })
  take: number;

  @Field(() => Number, { defaultValue: 0 })
  skip: number;
}
