import { Field, ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType()
export class ValidateOutput extends response {
  @Field(() => Boolean, { defaultValue: false })
  is_valid: boolean;
}
