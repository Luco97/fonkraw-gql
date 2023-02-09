import { ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('update_manga')
export class UpdateOutput extends response {}
