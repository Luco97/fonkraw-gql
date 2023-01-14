import { HttpStatus, Injectable } from '@nestjs/common';

import { ReadAllOutput } from '../outputs/read.output';
import { CreateOutput } from '../outputs/create.output';
import { DeleteOutput } from '../outputs/delete.output';
import { UserModelService } from '@database/models/user';
import { MangaModelService } from '@database/models/manga';
import { CommentModel, CommentModelService } from '@database/models/comment';

@Injectable()
export class CommentService {
  constructor(
    private _userModel: UserModelService,
    private _mangaModel: MangaModelService,
    private _commentModel: CommentModelService,
  ) {}

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

  create(parameters: { comment: string; manga_id: number; user_id: number }) {
    const { comment, manga_id, user_id } = parameters;

    return new Promise<CreateOutput>((resolve, reject) =>
      this._mangaModel.check_one(manga_id, true).then((count) => {
        if (!count)
          resolve({
            status: HttpStatus.OK,
            message: `that manga does't exist :(`,
          });
        else
          Promise.all([
            this._commentModel.create({ comment, manga_id, user_id }),
            this._userModel.find_one_by_id(user_id),
          ]).then(([new_comment, user_info]) => {
            console.log(new_comment);
            new_comment.user = user_info;
            resolve({
              status: HttpStatus.CREATED,
              message: `comment created`,
              comment: new_comment,
            });
          });
      }),
    );
  }

  delete(parameters: { comment_id: number; user_id: number }) {
    const { comment_id, user_id } = parameters;

    return new Promise<DeleteOutput>((resolve, reject) => {
      this._commentModel
        .find_one_by_user({ id: comment_id, user_id })
        .then((comment) => {
          if (!comment)
            resolve({
              status: HttpStatus.NOT_FOUND,
              message: `comment with id = ${comment_id} not found`,
            });
          else
            this._commentModel.delete(comment_id).then(() =>
              resolve({
                status: HttpStatus.OK,
                message: `comment with id: ${comment_id} deleted`,
              }),
            );
        });
    });
  }
}
