
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { WsMiddleware } from '../middleware/ws.middleware';
import { GameService } from '../services/game.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server?: Server;

  constructor(private readonly gameService: GameService) {}

  // (ROOM CHAT)
  @SubscribeMessage('sendRoomMessage')
  handleRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; message: string },
  ) {
    if (!client.data.user) return;

    const rawUserId = client.data?.user?.userId;
    const userId = Number(rawUserId);

    if (!Number.isInteger(userId)) {
      client.emit(`error`, { message: 'Unauthorized user id' });
      return;
    }

    const game = this.gameService.getGame(data.gameId);
    if (!game) return;

    const { username, avatarUrl } = client.data.user;

    const newMessage = {
      from: username,
      avatarUrl: avatarUrl,
      message: data.message,
      timeStamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    game.chatHistory.push(newMessage);

    this.server?.to(data.gameId).emit('receiveRoomMessage', newMessage);
  }

  //(PRIVATE MESSAGES)
  @SubscribeMessage('sendPrivateMessage')
  handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { toUserId: string; message: string },
  ) {
    const fromUserId = client.data.user.userId;

    this.server?.to(`user_${data.toUserId}`).emit('receivePrivateMessage', {
      fromId: fromUserId,
      message: data.message,
      timestamp: new Date().toLocaleTimeString(),
    });
  }
}
