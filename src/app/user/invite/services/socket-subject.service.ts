import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

import { InviteModel } from '@database/models/invite';

interface invite_data {
  author_id: number;
  comment: string;
  invite: InviteModel;
}

@Injectable()
export class SocketSubjectService {
  private _socket_subject: Subject<invite_data> = new Subject<invite_data>();

  get invite_subject_obs(): Observable<invite_data> {
    return this._socket_subject.asObservable();
  }

  send_invite(parameters: invite_data): void {
    this._socket_subject.next(parameters);
  }
}
