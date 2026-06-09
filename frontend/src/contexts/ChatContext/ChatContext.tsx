import { createContext, useContext, useEffect, useState } from "react";
import type { ChatContextType, PrivateMessage } from "./ChatContextType";
import { useGlobalSocket } from "../GlobalSocketContext/GlobalSocketContext";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
	const { socket } = useGlobalSocket();
	const [privateChats, setPrivateChats] = useState<Record<string, PrivateMessage[]>>({});
	const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

	const sendPrivateMessage = (recipientId: string, text: string) => {
		if (!socket) return;

		socket.emit("sendPrivateMessage", { recipientId, text });
	};

	useEffect(() => {
		if (!socket) return;

		const onReceiveMessage = (msg: PrivateMessage) => {
			setPrivateChats((prev) => {
				const chatRoomId = msg.senderId;
				const currentRoomMessage = prev[chatRoomId] || [];
				return { ...prev, [chatRoomId]: [...currentRoomMessage, msg] };
			});
		};

		const onMessageSent = (msg: PrivateMessage) => {
			if (!activeChatUserId) return;

			setPrivateChats((prev) => {
				const chatRoomId = msg.senderId;
				const currentRoomMessage = prev[chatRoomId] || [];
				return { ...prev, [chatRoomId]: [...currentRoomMessage, msg] };
			});
		};
		socket.on("receivePrivateMessage", onReceiveMessage);
		socket.on("privateMessageSent", onMessageSent);
		return () => {
			socket.off("receivePrivateMessage", onReceiveMessage);
			socket.off("privateMessageSent", onMessageSent);
		};
	}, [socket, activeChatUserId]);

	return (
		<ChatContext.Provider value={{ privateChats, sendPrivateMessage, activeChatUserId, setActiveChatUserId }}>
			{children}
		</ChatContext.Provider>
	);
};

export const userChat = () => {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error("useChat must be used within a ChatProvider");
	}

	return context;
};
