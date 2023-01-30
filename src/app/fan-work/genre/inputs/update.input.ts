import { Field, InputType } from '@nestjs/graphql';

@InputType('update_genre_description')
export class UpdateInput {
  @Field(() => Number)
  genre_id: number;

  @Field(() => String)
  new_description: string;
}
