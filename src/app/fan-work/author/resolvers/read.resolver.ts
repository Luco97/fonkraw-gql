import { HttpStatus } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { AuthorModelService } from '@database/models/author';
import { ReadInput } from '../inputs/read.input';
import { ReadAllOutput, ReadOneOutput } from '../outputs/read.output';

@Resolver()
export class ReadResolver {
  constructor(private _authorModel: AuthorModelService) {}

  @Query(() => ReadAllOutput, { name: 'find_all_authors' })
  findAll(
    @Args('options', {
      // variable not defined
      defaultValue: {
        alias: '',
        take: 10,
        skip: 0,
        orderBy: 'created_at',
        order: 'ASC',
      },
      nullable: true,
    })
    readAuthors: ReadInput,
  ): Promise<ReadAllOutput> {
    const { order, orderBy, skip, take, alias } = readAuthors || {
      alias: '',
      take: 10,
      skip: 0,
      orderBy: 'created_at',
      order: 'ASC',
    }; // variable or Args 'options': null;
    return new Promise<ReadAllOutput>((resolve, reject) => {
      this._authorModel
        .find_all({
          alias,
          take,
          skip,
          order,
          orderProperty: orderBy,
        })
        .then(([authors, count]) =>
          resolve({
            authors,
            count,
            status: HttpStatus.OK,
            message: `amount of authors found: ${count}`,
          }),
        );
    });
  }

  @Query(() => ReadAllOutput, { name: 'find_one_author' })
  findOne(
    @Args('author_id', { nullable: false }) author_id: number,
  ): Promise<ReadOneOutput> {
    return new Promise<ReadOneOutput>((resolve, reject) => {
      this._authorModel.find_one(author_id).then((author) =>
        resolve({
          author,
          status: HttpStatus.OK,
          message: `author with id: ${author_id}`,
        }),
      );
    });
  }
}
