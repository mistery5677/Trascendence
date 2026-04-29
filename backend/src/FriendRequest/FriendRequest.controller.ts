import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { FriendRequestService } from './FriendRequest.service';
import { AuthGuard } from '../auth/guard/auth.guard';


@Controller('FriendRequest')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @UseGuards(AuthGuard)
  @Post('request')
  async sendFriendRequest(@Body('targetUsername') targetUsername: string, @Req() req) {
    // The ID sender comes from the authentication token (through AuthGuard)
    const senderId = req.user.userId; 
    
    return await this.friendRequestService.sendRequest(senderId, targetUsername);
  }
}