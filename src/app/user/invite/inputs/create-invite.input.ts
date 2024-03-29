import { Field, InputType } from '@nestjs/graphql';

@InputType('create_invite')
export class CreateInviteInput {
  @Field(() => Number, { nullable: false })
  to_author_id: number;

  @Field(() => Number, { nullable: false })
  manga_id: number;

  @Field(() => String, { nullable: true })
  comment: string;
}
