import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsUrl } from 'class-validator';

@InputType('create_manga_input')
export class CreateInput {
  @Field(() => String)
  @IsAlphanumeric()
  title: string;

  @Field(() => Number)
  pages: number;

  @Field(() => String)
  @IsUrl()
  cover_url: string;
}
