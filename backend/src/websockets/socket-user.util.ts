import type { Socket } from 'socket.io';

export type WsUser = {
  userId: string;
  username: string;
};

/** Reads `user` attached by `WsMiddleware` without treating `socket.data` as `any`. */
export function getWsUser(socket: Socket): WsUser | undefined {
  return wsUserFromSocketData(socket.data as unknown);
}

function wsUserFromSocketData(data: unknown): WsUser | undefined {
  if (typeof data !== 'object' || data === null || !('user' in data)) {
    return undefined;
  }
  const { user } = data as { user: unknown };
  if (typeof user !== 'object' || user === null) {
    return undefined;
  }
  const rec = user as Record<string, unknown>;
  if (typeof rec.userId !== 'string' || typeof rec.username !== 'string') {
    return undefined;
  }
  return { userId: rec.userId, username: rec.username };
}
