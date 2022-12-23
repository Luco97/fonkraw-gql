import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

interface invite_data {
  author_id: number;
  comment: string;
}

@Injectable()
export class SocketSubjectService {
  private _socket_subject: Subject<invite_data> = new Subject<invite_data>();

  get invite_subject_obs(): Observable<invite_data> {
    return this._socket_subject.asObservable();
  }

  set send_invite(parameters: invite_data) {
    this._socket_subject.next(parameters);
    return;
  }
}
