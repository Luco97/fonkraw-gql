import { GenreModel } from '@database/models/genre';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateGenresInput {
  @Field(() => Number)
  manga_id: number;

  @Field(() => [Number])
  add_genres: number[];

  @Field(() => [Number])
  drop_genres: number[];
}

@InputType()
export class UpdateStatusInput {
  @Field(() => Number)
  manga_id: number;

  @Field(() => Boolean)
  status: boolean;
}

@InputType()
export class UpdateInput {
  @Field(() => Number)
  manga_id: number;
}
