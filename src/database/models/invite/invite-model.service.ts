import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, UpdateResult } from 'typeorm';

import { InviteModel } from './invite.model';

@Injectable()
export class InviteModelService {
  constructor(
    @InjectRepository(InviteModel) private _inviRepo: Repository<InviteModel>,
  ) {}

  create(parameters: {
    comment: string;
    manga_id: number;
    to_author_id: number;
    from_author_id: number;
  }): Promise<InviteModel> {
    const { comment, manga_id, from_author_id, to_author_id } = parameters;
    return this._inviRepo.save(
      this._inviRepo.create({
        comment,
        from_author: { id: from_author_id },
        to_author: { id: to_author_id },
        manga: { id: manga_id },
      }),
    );
  }

  find_all_to_author(user_id: number): Promise<[InviteModel[], number]> {
    return (
      this._inviRepo
        .createQueryBuilder('invite')
        .leftJoinAndSelect('invite.to_author', 'to_author')
        .loadRelationCountAndMap(
          'to_author.mangas_count',
          'to_author.mangas',
          'mangos_to_author',
          (qb) => qb.orderBy('cnt'),
        )
        .leftJoin('to_author.user', 'user')
        .leftJoinAndSelect('invite.from_author', 'from_author')
        .loadRelationCountAndMap(
          'from_author.mangas_count',
          'from_author.mangas',
          'mangos_from_author',
          (qb) => qb.orderBy('cnt'),
        )
        // .where('to_author.id = :author_id', { author_id })
        .where('user.id = :user_id', { user_id })
        .andWhere('invite.status = :status', { status: false })
        .orderBy('invite.created_at')
        .getManyAndCount()
    );
  }

  find_all_from_author(parameters: {
    user_id: number;
    author_id: number;
  }): Promise<[InviteModel[], number]> {
    const { author_id, user_id } = parameters;
    return this._inviRepo
      .createQueryBuilder('invite')
      .leftJoin('invite.to_author', 'to_author')
      .leftJoin('to_author.user', 'user')
      .leftJoinAndSelect('invite.from_author', 'from_author')
      .where('from_author.id = :author_id', { author_id })
      .andWhere('user.id = :user_id', { user_id })
      .andWhere('invite.status = :status', { status: false })
      .orderBy('invite.created_at')
      .getManyAndCount();
  }

  find_all_from_manga(parameters: {
    user_id: number;
    manga_id: number;
  }): Promise<[InviteModel[], number]> {
    const { manga_id, user_id } = parameters;
    return this._inviRepo
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.to_author', 'to_author')
      .loadRelationCountAndMap(
        'to_author.mangas_count',
        'to_author.mangas',
        'mangos_to_author',
        (qb) => qb.orderBy('cnt'),
      )
      .leftJoinAndSelect('invite.from_author', 'from_author')
      .loadRelationCountAndMap(
        'from_author.mangas_count',
        'from_author.mangas',
        'mangos_from_author',
        (qb) => qb.orderBy('cnt'),
      )
      .leftJoin('from_author.user', 'user')
      .leftJoin('invite.manga', 'manga')
      .where('user.id = :user_id', { user_id })
      .andWhere('manga.id = :manga_id', { manga_id })
      .orderBy({ 'invite.created_at': 'ASC', 'invite.status': 'DESC' })
      .getManyAndCount();
  }

  // See if exist to update process
  check_invitation_exist(parameters: {
    // status: boolean;
    user_id: number;
    invite_id: number;
  }): Promise<InviteModel> {
    const { invite_id, user_id } = parameters;
    return this._inviRepo
      .createQueryBuilder('invite')
      .leftJoin('invite.to_author', 'to_author')
      .leftJoin('to_author.user', 'user')
      .where('invite.id = :invite_id', { invite_id })
      .andWhere('invite.status = :status', { status: false })
      .andWhere('user.id = :user_id', { user_id })
      .getOne();
  }

  // See if exist to send invitation
  invite_already_exist(parameters: {
    user_id: number;
    manga_id: number;
    to_author_id: number;
  }): Promise<InviteModel> {
    const { to_author_id, user_id, manga_id } = parameters;
    return this._inviRepo
      .createQueryBuilder('invite')
      .leftJoin('invite.to_author', 'to_author')
      .leftJoin('invite.from_author', 'from_author')
      .leftJoin('from_author.user', 'user')
      .leftJoin('invite.manga', 'manga')
      .where('user.id = :user_id', { user_id })
      .andWhere('to_author.id = :to_author_id', { to_author_id })
      .andWhere('manga.id = :manga_id', { manga_id })
      .getOne();
  }

  // If decline: delete, else update to true and not delete
  update(parameters: {
    status: boolean;
    invite_id: number;
  }): Promise<UpdateResult> {
    const { invite_id, status } = parameters;
    if (status) {
      return this._inviRepo.update({ id: invite_id }, { status });
    } else {
      return this._inviRepo.softDelete({ id: invite_id });
    }
  }
}
