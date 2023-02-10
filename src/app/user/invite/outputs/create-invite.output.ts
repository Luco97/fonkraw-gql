import { Field, ObjectType } from '@nestjs/graphql';

import { response } from '@utils/response.output';
import { InviteModel } from '@database/models/invite';

@ObjectType('create_invite_output')
export class CreateInviteOutput extends response {
  @Field(() => InviteModel, { nullable: true })
  invite?: InviteModel;
}
