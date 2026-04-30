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

  // Get the pending requests
  async getPendingRequests(userId: number) {
    return await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      // The prisma pulls all the sender information
      include: {
        sender: {
          select: { username: true } // Show the username instead of the Id
        }
      }
    });
  }

  // Accept friend requests
  async acceptRequest(receiverId: number, senderId: number) {
    // Search for the right pending request
    const request = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: senderId,
        receiverId: receiverId,
        status: 'PENDING',
      },
    });

    // If the request is already resolved, we throw an error
    if (request == null) {
      throw new NotFoundException("Friend request not found or already processed");
    }

    // Update the status for 'ACCEPTED'
    return await this.prisma.friendRequest.update({
      where: { id: request.id },
      data: { status: 'ACCEPTED' },
    });
  }

  // Decline friend request
  async declineRequest(receiverId: number, senderId: number) {
    // Search for the right pending request
    const request = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: senderId,
        receiverId: receiverId,
        status: 'PENDING',
      },
    });

    // If the request is already resolved, we throw an error
    if (request == null) {
      throw new NotFoundException("Friend request not found");
    }

    // We just delete the request from the data base
    return await this.prisma.friendRequest.delete({
      where: { id: request.id },
    });
  }

  // Get all the friends 
  async getFriends(userId: number) {
    const friends = await this.prisma.friendRequest.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    
    return friends.map(rel => {
      return rel.senderId === userId ? rel.receiver : rel.sender;
    });
  }

  // Remove the friend from the list
  async removeFriend(userId: number, friendId: number) {
    // Check the status if it is accepted
    const relation = await this.prisma.friendRequest.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    });

    if (!relation)
      throw new NotFoundException("Friendship not found");

    return await this.prisma.friendRequest.delete({
      where: { id: relation.id },
    });
  }
}