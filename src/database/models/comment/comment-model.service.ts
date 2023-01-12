import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, UpdateResult } from 'typeorm';

import { CommentModel } from './comment.model';

@Injectable()
export class CommentModelService {
  constructor(
    @InjectRepository(CommentModel)
    private _commentRepo: Repository<CommentModel>,
  ) {}

  find_all_from_manga(parameters: {
    take?: number;
    skip?: number;
    user_id: number;
    manga_id: number;
  }): Promise<[CommentModel[], number]> {
    const { manga_id, user_id, skip, take } = parameters;
    return this._commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.manga', 'manga')
      .leftJoinAndSelect('comment.user', 'user')
      .where('manga.id = :manga_id', { manga_id })
      .orderBy('comment.created_at', 'ASC')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  find_one_by_user(parameters: { id: number; user_id: number }) {
    const { id, user_id } = parameters;
    return this._commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .where('comment.id = :comment_id', { comment_id: id })
      .andWhere('user.id = :user_id', { user_id })
      .getOne();
  }

  create(parameters: {
    user_id: number;
    comment: string;
    manga_id: number;
  }): Promise<CommentModel> {
    const { comment, manga_id, user_id } = parameters;
    return this._commentRepo.save(
      this._commentRepo.create({
        comment,
        user: { id: user_id },
        manga: { id: manga_id },
      }),
    );
  }
  // Probar si id no existe :eyes:
  delete(comment_id: number): Promise<UpdateResult> {
    return this._commentRepo.softDelete({ id: comment_id });
  }
}
