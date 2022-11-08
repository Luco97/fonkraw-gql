import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class response {
  @Field(() => String, { nullable: true, defaultValue: 'message not defined' })
  message?: string;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  status?: Number;
}
