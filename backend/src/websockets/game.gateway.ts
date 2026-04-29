import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchMakingService } from './matchmaking/matchmaking.service';
import { JwtService } from '@nestjs/jwt';
import { WsMiddleware } from './middleware/ws.middleware';
import { timeStamp } from 'node:console';

@WebSocketGateway()
export class GameGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly matchMakingService: MatchMakingService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  afterInit() {
    this.server.use(WsMiddleware(this.jwtService));
  }

  handleDisconnect(client: Socket) {
    this.matchMakingService.removeFromQueue(client);
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.matchMakingService.addToQueue(client, this.server);
  }

  @SubscribeMessage('joinGame') handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    client.join(data.gameId);

    //! Implement when function it`s
    // const gameState = this.gameService.getGameState(data.gameId);
    // client.emit('gameState', gameState);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const { gameId, message } = parsedData;

    console.log(`Sending Message to the room: ${gameId}`);

    if (gameId) {
      this.server.to(gameId).emit('receiveMessage', {
        from: client.data.user.username,
        message: message,
        timeStamp: new Date().toLocaleTimeString(),
      });
    } else {
      console.error("ERROR: gameId Wasn't sended on message");
    }
  }
}
