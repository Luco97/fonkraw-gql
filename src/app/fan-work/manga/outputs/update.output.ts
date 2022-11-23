import { ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType()
export class UpdateOutput extends response {}
