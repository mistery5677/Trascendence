export type User = {
	id: string;
	name: string | null;
	username: string;
	email: string;
	avatarUrl: string;
	createdAt: string;
	updateAt: string;
};

export type AuthState = {
	user: User | null;
	isLoading: boolean;
};

export type AuthAction = { type: "AUTH_LOADING" } | { type: "AUTH_SUCCESS"; payload: User } | { type: "AUTH_LOGOUT" };
