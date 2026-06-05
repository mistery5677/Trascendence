import { JwtService } from '@nestjs/jwt';
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

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server?: Server;

  constructor(private readonly userService: UsersService) {}

  // (ROOM CHAT)
  @SubscribeMessage('sendRoomMessage')
  async handleRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; message: string },
  ) {
    const rawUserId = client.data?.user?.userId;
    const userId = Number(rawUserId);

    if (!Number.isInteger(userId)) {
      client.emit(`error`, { message: 'Unauthorized user id' });
      return;
    }

    const user = await this.userService.findOneById(client.data.user.userId);

    this.server?.to(data.gameId).emit('receiveRoomMessage', {
      from: client.data.user.username,
      avatarUrl: user?.avatarUrl,
      message: data.message,
      timeStamp: new Date().toLocaleTimeString(),
    });
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
