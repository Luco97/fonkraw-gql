import { HttpStatus } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthorModelService } from '@database/models/author';
import { ReadInput } from '../inputs/read.input';
import { ReadAllOutput, ReadOneOutput } from '../outputs/read.output';

@Resolver()
export class ReadResolver {
  constructor(private _authorModel: AuthorModelService) {}

  @Query(() => ReadAllOutput, { name: 'find_all_authors' })
  findAll(@Args('parameters') readAuthors: ReadInput): Promise<ReadAllOutput> {
    const { order, orderBy, skip, take, alias } = readAuthors;
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
  findOne(@Args('author_id') author_id: number): Promise<ReadOneOutput> {
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
