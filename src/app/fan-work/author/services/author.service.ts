import { Injectable, HttpStatus } from '@nestjs/common';

import { response } from '@utils/response.output';
import { AuthorModelService } from '@database/models/author';
import { CreateOutput } from '../outputs/create.output';

@Injectable()
export class AuthorService {
  constructor(private _authorModel: AuthorModelService) {}

  create(parameters: {
    alias: string;
    description: string;
    user_id: number;
  }): Promise<CreateOutput> {
    const { alias, description, user_id } = parameters;

    return new Promise<CreateOutput>((resolve, reject) => {
      this._authorModel.author_check({ user_id, alias }).then((author) => {
        if (author)
          resolve({
            author,
            message: 'author already exist',
            status: HttpStatus.AMBIGUOUS,
          });
        else
          this._authorModel
            .create({ alias, description, user_id })
            .then((new_author) =>
              resolve({
                author: new_author,
                message: `Happy to see you, ${new_author.alias}`,
                status: HttpStatus.OK,
              }),
            );
      });
    });
  }

  update_info(parameters: {
    description: string;
    user_id: number;
  }): Promise<response> {
    const { description, user_id } = parameters;

    return new Promise<response>((resolve, reject) => {
      this._authorModel.author_check({ user_id }).then((author) => {
        if (!author)
          resolve({
            message: 'author not found',
            status: HttpStatus.NOT_FOUND,
          });
        else
          this._authorModel
            .update({ author_id: author.id, description })
            .then(() =>
              resolve({
                message: 'description updated',
                status: HttpStatus.ACCEPTED,
              }),
            );
      });
    });
  }
}
