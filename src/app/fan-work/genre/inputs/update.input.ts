import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateInput {
  @Field(() => Number)
  genre_id: number;

  @Field(() => String)
  new_description: string;
}
