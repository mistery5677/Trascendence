import { Injectable, NotFoundException } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { from } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMessage(fromUserId: number, toUserId: number, message: string) {
    const recipientExists = await this.prismaService.user.findUnique({
      where: { id: toUserId },
    });
    if (!recipientExists) {
      throw new NotFoundException('Recipient not found.');
    }
    return this.prismaService.privateMessage.create({
      data: {
        fromId: fromUserId,
        toId: toUserId,
        message: message,
      },
      include: { fromUser: { select: { username: true, avatarUrl: true } } },
    });
  }

  async getChatHistory(userIdA: number, userIdB: number, limit = 50) {
    return this.prismaService.privateMessage.findMany({
      where: {
        OR: [
          { fromId: userIdA, toId: userIdB },
          { fromId: userIdB, toId: userIdA },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
      include: { fromUser: { select: { username: true, avatarUrl: true } } },
    });
  }
}
