import { Field, InputType } from '@nestjs/graphql';

@InputType('update_manga_genres')
export class UpdateGenresInput {
  @Field(() => Number)
  manga_id: number;

  @Field(() => [Number])
  add_genres: number[];

  @Field(() => [Number])
  drop_genres: number[];
}

@InputType('update_manga_status')
export class UpdateStatusInput {
  @Field(() => Number)
  manga_id: number;

  @Field(() => Boolean)
  status: boolean;
}
