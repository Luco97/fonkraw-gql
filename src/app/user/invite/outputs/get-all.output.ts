import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { InviteModel } from '@database/models/invite';

@ObjectType()
export class GetAllOutput extends response {
  @Field(() => [InviteModel])
  invites: InviteModel[];

  @Field(() => Number)
  count: number;
}
