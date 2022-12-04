import { Field, InputType } from '@nestjs/graphql';

@InputType('create_comment')
export class CreateInput {
  @Field(() => String) comment: string;

  @Field(() => Number) manga_id: number;
}
