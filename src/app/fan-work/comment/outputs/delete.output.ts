import { ObjectType } from '@nestjs/graphql';
import { response } from '@utils/response.output';

@ObjectType('delete_comment_output')
export class DeleteOutput extends response {}
