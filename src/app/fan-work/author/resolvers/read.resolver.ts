import { Args, Query, Resolver } from '@nestjs/graphql';

import { find_all_default } from '@utils/find-all.input';

import { ReadInput } from '../inputs/read.input';
import { AuthorService } from '../services/author.service';
import { ReadAllOutput, ReadOneOutput } from '../outputs/read.output';

@Resolver()
export class ReadResolver {
  constructor(private _authorModel: AuthorService) {}

  @Query(() => ReadAllOutput, { name: 'find_all_authors' })
  find_all(
    @Args('options', {
      // variable not defined
      defaultValue: {
        alias: '',
        ...find_all_default,
      },
      nullable: true,
    })
    readAuthors: ReadInput,
  ): Promise<ReadAllOutput> {
    const { order, orderBy, skip, take, alias } = readAuthors || {
      alias: '',
      ...find_all_default,
    }; // variable or Args 'options': null;

    return this._authorModel.find_all({ alias, order, orderBy, skip, take });
  }

  @Query(() => ReadAllOutput, { name: 'find_one_author' })
  find_one(
    @Args('author_id', { nullable: false }) author_id: number,
  ): Promise<ReadOneOutput> {
    return this._authorModel.find_one(author_id);
  }
}
