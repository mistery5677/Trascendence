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
	const myUserId = state.user?.id;

	const sendPrivateMessage = (toUserId: string, message: string) => {
		if (!socket) return;

		socket.emit("sendPrivateMessage", { toUserId, message });
	};

	useEffect(() => {
		if (!socket) return;

		const onReceiveMessage = (msg: PrivateMessage) => {
			setPrivateChats((prev) => {
				const amITheSender = String(msg.fromId) === String(myUserId);
				const chatPartnerId = amITheSender ? String(msg.toId) : String(msg.fromId);
				const currentRoomMessage = prev[chatPartnerId] || [];
				console.log(chatPartnerId);
				return { ...prev, [chatPartnerId]: [...currentRoomMessage, msg] };
			});
		};
		socket.on("receivePrivateMessage", onReceiveMessage);
		return () => {
			socket.off("receivePrivateMessage", onReceiveMessage);
		};
	}, [socket, myUserId]);

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
