import { Injectable, HttpStatus } from '@nestjs/common';

import { UserModelService } from '@database/models/user';
import { InviteModelService } from '@database/models/invite';
import { GetAllOutput } from '../outputs/get-all.output';
import { CreateInviteOutput } from '../outputs/create-invite.output';

@Injectable()
export class InviteService {
  constructor(
    private _userService: UserModelService,
    private _inviteModel: InviteModelService,
  ) {}

  get_all_invites(user_id: number): Promise<GetAllOutput> {
    return new Promise<GetAllOutput>((resolve, reject) =>
      this._inviteModel.find_all_to_author(user_id).then(([invites, count]) =>
        resolve({
          invites,
          count,
          message: `invites found: ${count}`,
          status: HttpStatus.OK,
        }),
      ),
    );
  }

  all_invite_manga(parameters: {
    manga_id: number;
    user_id: number;
  }): Promise<GetAllOutput> {
    const { manga_id, user_id } = parameters;
    return new Promise<GetAllOutput>((resolver, reject) =>
      this._inviteModel
        .find_all_from_manga({ manga_id, user_id })
        .then(([invites, count]) =>
          resolver({
            invites,
            count,
            message: `authors invites found: ${count}`,
            status: HttpStatus.OK,
          }),
        ),
    );
  }

  create_invite(parameters: {
    manga_id: number;
    user_id: number;
    to_author_id: number;
  }) {
    const { user_id, manga_id, to_author_id } = parameters;
    return new Promise<CreateInviteOutput>((resolver, reject) => {
      Promise.all([
        this._userService.author_check({ author_id: to_author_id }), // check if this author exist
        this._userService.manga_creator({ user_id, manga_id }), // check if the user is creator of this manga
        this._inviteModel.find_invite_origin({
          manga_id,
          to_author_id,
          user_id,
        }), // check if already exist one invite register in DB (in the manga_id)
      ]).then(([author_exist, is_valid, valid_invite]) => {
        if (!(author_exist?.id && is_valid && valid_invite?.id)) resolver({});
        else {
          // author_exist.email send email of invite
          // emit with socket notification
        }
      });
    });
  }
}
