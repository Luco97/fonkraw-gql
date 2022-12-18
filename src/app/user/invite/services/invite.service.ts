import { Injectable, HttpStatus } from '@nestjs/common';
import { InviteModelService } from '@database/models/invite';
import { GetAllOutput } from '../outputs/get-all.output';

@Injectable()
export class InviteService {
  constructor(private _inviteModel: InviteModelService) {}

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
}
