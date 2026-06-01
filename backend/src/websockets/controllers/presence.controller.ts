import { Controller, Get } from '@nestjs/common';
import { PresenceService } from '../services/presence.service';
import { UsersService } from 'src/users/users.service';

@Controller('presence')
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly usersService: UsersService,
  ) {}

  @Get('online-user')
  async allOnlineUsers() {
    const connectedUsersStr = this.presenceService.getConnectedUsers();

    const connectedUserIdsNum = connectedUsersStr.map((id) => parseInt(id, 10));

    const onlineUsersData =
      await this.usersService.findByIds(connectedUserIdsNum);

    return onlineUsersData;
  }
}
