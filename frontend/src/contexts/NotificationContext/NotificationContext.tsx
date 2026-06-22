import { createContext, useContext, useEffect, useState } from "react";
import { type NotificationContextType, type NotificationType } from "./notificationTypes";
import { useGlobalSocket } from "../GlobalSocketContext/GlobalSocketContext";
import { getMyNotifications, markNotificationsAsReadBackend } from "../../api/users";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
	const { socket } = useGlobalSocket();
	const [notifications, setNotifications] = useState<NotificationType[]>([]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	useEffect(() => {
		const fetchNotifications = async () => {
			const data = await getMyNotifications();
			setNotifications(data);
		};
		fetchNotifications();
	}, []);

	useEffect(() => {
		if (!socket) return;

		const handleIncomingNotification = (newNotification: NotificationType) => {
			setNotifications((prev) => [newNotification, ...prev]);
		};
		
		socket.on("notification", handleIncomingNotification);
		return () => {
			socket.off("notification", handleIncomingNotification);
		};
	}, [socket]);

	const markAllAsRead = async () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		await markNotificationsAsReadBackend();
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
