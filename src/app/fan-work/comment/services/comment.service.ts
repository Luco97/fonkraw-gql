import { HttpStatus, Injectable } from '@nestjs/common';

import { ReadAllOutput } from '../outputs/read.output';
import { CommentModel, CommentModelService } from '@database/models/comment';

@Injectable()
export class CommentService {
  constructor(private _commentModel: CommentModelService) {}

  find_all(parameters: {
    take?: number;
    skip?: number;
    user_id: number;
    manga_id: number;
  }): Promise<ReadAllOutput> {
    const { manga_id, user_id, skip, take } = parameters;
    return new Promise<ReadAllOutput>((resolve, reject) =>
      this._commentModel
        .find_all_from_manga({ manga_id, user_id, skip, take })
        .then(([comments, count]) =>
          resolve({
            count,
            comments: comments.map<CommentModel>((element) => ({
              ...element,
              deletable: element.user.id == user_id,
            })),
            status: HttpStatus.OK,
            message: `total comments: ${count}`,
          }),
        ),
    );
  }
}
