import { ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('update_genre')
export class UpdateOutput extends response {}
