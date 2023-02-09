import { ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('update_genre_output')
export class UpdateOutput extends response {}
