import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
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
  _clients_map: client_map = {};

  constructor(private _socketSubject: SocketSubjectService) {}

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
        tap(({ author_id, comment }) => {
          this._clients;
        }),
      )
      .subscribe();
  }

  handleConnection(client: Socket, ...args: any[]) {
    this._logger.log(`client log`);
    this._clients.push(client);
    if (client.handshake.headers?.authorization)
      this._clients_map[`${client.handshake.headers?.authorization}`] = client;
    client.emit('aaa', { xd: 'aaaaaaaaaaaaaaaaa' });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
