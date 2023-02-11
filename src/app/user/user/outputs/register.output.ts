import { ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('register_output', {
  description: 'output object of register_user',
})
export class RegisterOutput extends response {}
