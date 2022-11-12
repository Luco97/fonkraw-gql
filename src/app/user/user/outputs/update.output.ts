import { Field, ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('update_user_info_output', { description: 'user update output' })
export class UpdateOutput extends response {
  @Field(() => String, { nullable: true })
  imagen_url?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
