import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, MinLength } from 'class-validator';

@InputType('create_author_input')
export class CreateInput {
  @Field(() => String)
  @IsAlphanumeric()
  @MinLength(3)
  alias: string;

  @Field(() => String, { nullable: true, defaultValue: '' })
  description: string;
}
