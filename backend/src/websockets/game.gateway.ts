import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from './guard/ws.guard';
import { MatchMakingService } from './matchmaking/matchmaking.service';

@WebSocketGateway()
@UseGuards(WsGuard)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly matchMakingService: MatchMakingService) {}

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.matchMakingService.addToQueue(client, this.server);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.matchMakingService.removeFromQueue(client);
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(data);
    // this.server.emit('messageserver', data);
    client.broadcast.emit('messageserver', data);
  }
}
