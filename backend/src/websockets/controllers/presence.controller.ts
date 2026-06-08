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
    const connectedUsers = this.presenceService.getConnectedUsers();

    const onlineUsersData = await this.usersService.findByIds(connectedUsers);

    return onlineUsersData;
  }
}
