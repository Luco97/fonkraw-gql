import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AuthService } from '@shared/auth';
import { tap } from 'rxjs';

import { Socket, Server } from 'socket.io';
import { SocketSubjectService } from '../services/socket-subject.service';

interface client_map {
  [key: string]: Socket;
}

@WebSocketGateway()
export class InviteGateway {
  private readonly _logger = new Logger(InviteGateway.name);
  private _clients: Socket[] = [];
  private _clients_map: client_map = {};

  constructor(
    private _authService: AuthService,
    private _socketSubject: SocketSubjectService,
  ) {}

  handleDisconnect(client: Socket) {
    this._logger.log(`client drop`);
    this._clients.splice(
      this._clients.findIndex((client_in) => client_in.id == client.id),
      1,
    );
    this._clients_map[client.id] = undefined;
  }

  afterInit(server: Server) {
    this._logger.log('Server init');
    this._socketSubject.invite_subject_obs
      .pipe(
        tap(({ author_id, comment, invite }) => {
          if (this._clients_map[`${author_id}`])
            this._clients_map[`${author_id}`].emit('invite_listener', {
              invite,
              comment,
              message: `invited by ${invite.from_author.alias} for manga: ${invite.manga.title}`,
            });
        }),
      )
      .subscribe();
  }

  handleConnection(client: Socket, ...args: any[]) {
    const token: string = client.handshake.headers?.authorization;
    const user = this._authService.userObject(token);
    if (user.context.author_id) {
      this._clients_map[`${user.context.author_id}`] = client;
      this._clients.push({ ...client } as Socket);
      this._logger.log(`client log`);
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
