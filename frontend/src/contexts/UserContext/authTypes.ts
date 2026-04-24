export type User = {
  id: number;
  name: string | null;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updateAt: string;

  wins: number;
  losses: number;
  draws: number;
  elo: number;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
};

export type AuthAction =
  | { type: "AUTH_LOADING" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_LOGOUT" };
