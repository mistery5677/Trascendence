export type NotificationType = {
	id: string;
	title: string;
	message: string;
	type: "matchInvite" | "system" | "friendRequest";
	read: boolean;
	createdAt: string;
	payload?: any;
};

export type NotificationContextType = {
	notifications: NotificationType[];
	unreadCount: number;
	markAllAsRead: () => void;
	clearNotifications: () => void;
};
