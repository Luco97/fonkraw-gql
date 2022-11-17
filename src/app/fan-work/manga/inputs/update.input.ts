import { GenreModel } from '@database/models/genre';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateGenresInput {
  @Field(() => Number)
  manga_id: number;

  @Field(() => [GenreModel])
  add_genres: GenreModel[];

  @Field(() => [GenreModel])
  drop_genres: GenreModel[];
}

// @InputType()
// export class UpdateStatusInput {
//   @Field(() => Number)
//   manga_id: number;
// }

@InputType()
export class UpdateInput {
  @Field(() => Number)
  manga_id: number;
}
