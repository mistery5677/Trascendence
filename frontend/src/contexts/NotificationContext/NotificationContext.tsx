import { createContext, useContext, useEffect, useState } from "react";
import { type NotificationContextType, type NotificationType } from "./notificationTypes";
import { useGlobalSocket } from "../GlobalSocketContext/GlobalSocketContext";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
	const { socket } = useGlobalSocket();
	const [notifications, setNotifications] = useState<NotificationType[]>([]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	useEffect(() => {
		if (!socket) return;

		const handleIncomingNotification = (data: Omit<NotificationType, "read" | "createdAt">) => {
			const newNotification: NotificationType = { ...data, read: false, createdAt: new Date().toISOString() };
			setNotifications((prev) => [newNotification, ...prev]);
		};
		socket.on("notification", handleIncomingNotification);
		return () => {
			socket.off("notification", handleIncomingNotification);
		};
	}, [socket]);

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	};

	const clearNotifications = () => {
		setNotifications([]);
	};

	return (
		<NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, clearNotifications }}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (!context) throw new Error("useNotifications must use on NotificationProvider");
	return context;
};
