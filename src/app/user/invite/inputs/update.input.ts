import { Field, InputType } from '@nestjs/graphql';

@InputType('update_invite')
export class UpdateInput {
  @Field(() => Number, { nullable: false })
  manga_id: number;

  @Field(() => Number, { nullable: false })
  invite_id: number;

  @Field(() => Boolean)
  accept: boolean;
}
