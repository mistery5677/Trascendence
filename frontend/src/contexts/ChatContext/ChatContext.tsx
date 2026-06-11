import { createContext, useContext, useEffect, useState } from "react";
import type { ChatContextType, PrivateMessage } from "./ChatContextType";
import { useGlobalSocket } from "../GlobalSocketContext/GlobalSocketContext";
import { useAuth } from "../UserContext";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
	const { socket } = useGlobalSocket();
	const [privateChats, setPrivateChats] = useState<Record<string, PrivateMessage[]>>({});
	const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
	const { state } = useAuth();

	const sendPrivateMessage = (toUserId: string, message: string) => {
		if (!socket) return;
		socket.emit("sendPrivateMessage", { toUserId: String(toUserId), message: message.trim() });
	};

	useEffect(() => {
		if (!socket) return;

		const onReceiveMessage = (msg: PrivateMessage) => {
			const currentUserId = state.user?.id ? String(state.user.id) : null;
			if (!currentUserId) return;

			const msgFromId = String(msg.fromId);
			const msgToId = String(msg.toId);

			const amITheSender = msgFromId === currentUserId;
			const chatPartnerId = amITheSender ? msgToId : msgFromId;

			setPrivateChats((prev) => {
				const previousMessages = prev[chatPartnerId] ? [...prev[chatPartnerId]] : [];
				const isDuplicate = previousMessages.some(
					(m) => m.timestamp === msg.timestamp && m.message === msg.message && m.fromId === msgFromId,
				);

				if (isDuplicate) return prev;

				return {
					...prev,
					[chatPartnerId]: [...previousMessages, msg],
				};
			});
		};

		socket.on("receivePrivateMessage", onReceiveMessage);

		return () => {
			socket.off("receivePrivateMessage", onReceiveMessage);
		};
	}, [socket, state.user?.id]);

	return (
		<ChatContext.Provider value={{ privateChats, sendPrivateMessage, activeChatUserId, setActiveChatUserId }}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error("useChat must be used within a ChatProvider");
	}

	return context;
};
