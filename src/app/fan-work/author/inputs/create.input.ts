import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, MinLength } from 'class-validator';

@InputType()
export class CreateInput {
  @Field(() => String)
  @IsAlphanumeric()
  @MinLength(3)
  alias: string;

  @Field(() => String, { nullable: true, defaultValue: '' })
  description: string;
}
