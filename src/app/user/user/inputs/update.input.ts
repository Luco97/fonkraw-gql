import { Field, InputType } from '@nestjs/graphql';

@InputType('update_user_info_input', { description: 'update user input' })
export class UpdateInput {
  @Field(() => String, { nullable: true })
  image_url?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
