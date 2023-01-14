import { Injectable, HttpStatus } from '@nestjs/common';

import { response } from '@utils/response.output';
import { AuthorModelService } from '@database/models/author';

@Injectable()
export class AuthorService {
  constructor(private _authorModel: AuthorModelService) {}

  update_info(parameters: { description: string; user_id: number }) {
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
