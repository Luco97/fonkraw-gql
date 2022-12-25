import { extend, ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('update_input_output')
export class UpdateOutput extends response {}
