import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(senderId: number, targetUsername: string){
    // Find the invited user
    const receiver = await this.prisma.user.findUnique({
      where: { username: targetUsername},
    });

    if (receiver == null){
      throw new NotFoundException("Username not founded");
    }

    // Block to send the friend request from the sender
    if (senderId == receiver.id){
      throw new BadRequestException("You can not send a friend request to yourself");
    }

    // Check if you already have a friend request with that user
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiver.id },
          { senderId: receiver.id, receiverId: senderId },
        ],
      },
    });

    // Send a error if already have a friend request
    if (existingRequest){
      // If the friend request is pending
      if (existingRequest.status === 'PENDING'){
        throw new ConflictException("Already exist a pendent friend request");
      }

      // If you already are friends
      if (existingRequest.status === 'ACCEPTED'){
        throw new ConflictException("You already are friends");
      }
    }

    return await this.prisma.friendRequest.create({
      data: {
        senderId: senderId,
        receiverId: receiver.id,
        status: 'PENDING',
      }
    });
  }
}