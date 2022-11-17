import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInput {
  @Field(() => String)
  title: string;

  @Field(() => Number)
  pages: number;

  @Field(() => String)
  cover_url: string;
}
