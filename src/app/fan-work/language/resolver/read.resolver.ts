import { HttpStatus } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { LanguageModelService } from '@database/models/language';
import { ReadOutput } from '../outputs/read.output';

@Resolver()
export class ReadResolver {
  constructor(private _languageModel: LanguageModelService) {}

  @Query(() => ReadOutput)
  find_all_languages(): Promise<ReadOutput> {
    return new Promise<ReadOutput>((resolve, reject) =>
      this._languageModel.find_all().then(([languages, count]) =>
        resolve({
          count,
          languages,
          message: `languages found: ${count}`,
          status: HttpStatus.OK,
        }),
      ),
    );
  }
}
