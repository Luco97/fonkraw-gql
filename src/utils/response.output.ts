import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class response {
  @Field(() => String, {
    nullable: true,
    defaultValue: 'message not defined',
    description: 'message for extra info',
  })
  message?: string;

  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
    description: 'status response',
  })
  status?: Number;
}
