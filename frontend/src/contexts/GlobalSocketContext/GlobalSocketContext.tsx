import { Children, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../UserContext";

type GlobalSocketContextType = {
	socket: Socket | null;
	isOnline: boolean;
};

const GlobalSocketContext = createContext<GlobalSocketContextType | undefined>(undefined);

export const GlobalSocketProvider = ({ children }: { children: React.ReactNode }) => {
	const { state: authState } = useAuth();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isOnline, setIsOnline] = useState(false);

	useEffect(() => {
		if (!authState.user) {
			setSocket(null);
			setIsOnline(false);
			return;
		}

		console.log("Initialize Global Socket to check Presence");
		const socketInstance = io("/", {
			withCredentials: true,
			path: "/socket.io",
			transports: ["websocket"],
			autoConnect: false,
		});

		socketInstance.on("connect", () => {
			console.log("Global Socket Connected");
			setIsOnline(true);
		});

		socketInstance.on("disconnect", () => {
			console.warn("Global Socket Disconnected");
			setIsOnline(false);
		});
		//! Can add here catch notifications ?? Or Other events
		socketInstance.connect();
		setSocket(socketInstance);
		return () => {
			console.log("Disconnected Global Socket by logout or close Browser");

			socketInstance.off("connect");
			socketInstance.off("disconnect");

			socketInstance.disconnect();
		};
	}, [authState.user]);

	return <GlobalSocketContext.Provider value={{ socket, isOnline }}>{children}</GlobalSocketContext.Provider>;
};

export const useGlobalSocket = () => {
	const context = useContext(GlobalSocketContext);
	if (!context) {
		throw new Error("useGlobalSocket must be used inside GlobalSocketProvider");
	}
	return context;
};
