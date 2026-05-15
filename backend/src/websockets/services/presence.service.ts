import { Injectable } from '@nestjs/common';

export type UserStatus = 'online' | 'playing' | 'offline';

@Injectable()
export class PresenceService {
  private userStatus = new Map<string, UserStatus>();
  private activeSockets = new Map<string, string>();

  setConnected(userId: string, socketId: string) {
    this.activeSockets.set(userId, socketId);
    this.userStatus.set(userId, 'online');
  }

  setDisconnected(userId: string) {
    this.activeSockets.delete(userId);
    this.userStatus.delete(userId);
  }

  updateStatus(userId: string, status: UserStatus) {
    if (this.userStatus.has(userId)) {
      this.userStatus.set(userId, status);
    }
  }
  getStatus(userId: string): UserStatus {
    return this.userStatus.get(userId) || 'offline';
  }
}
