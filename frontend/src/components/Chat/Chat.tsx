import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useGame } from "../../contexts/GameContext/GameContext";
import { ChatHeader, ChatMessages, ChatInput } from "./index";

type Message = {
	from: string;
	avatarUrl?: string;
	message: string;
	timeStamp: string;
};

export function Chat() {
	const { socket, gameId } = useGame();
	const messageContainerRef = useRef<HTMLDivElement | null>(null);

	// const [messages, setMessages] = useState<{ from: string; message: string; timeStamp: string }[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const [pendingNewMessages, setPendingNewMessages] = useState(false);

	useEffect(() => {
		socket?.on("receiveMessage", (msg: any) => {
			console.log(msg);
			setMessages((prev) => {
				if (!isAtBottom) {
					setPendingNewMessages(true);
				}
				return [...prev, msg];
			});
		});
		return () => {
			socket?.off("receiveMessage");
		};
	}, [socket, isAtBottom]);

	useEffect(() => {
		const container = messageContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
			const atBottom = distanceFromBottom < 100;
			setIsAtBottom(atBottom);
			if (atBottom) {
				setPendingNewMessages(false);
			}
		};

		container.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useLayoutEffect(() => {
		const container = messageContainerRef.current;
		if (!container) return;

		if (isAtBottom) {
			container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
			setPendingNewMessages(false);
		}
	}, [messages, isAtBottom]);

	const sendMessage = (message: string) => {
		socket?.emit("sendMessage", { gameId, message });
	};

	const scrollToBottom = () => {
		const container = messageContainerRef.current;
		if (!container) return;
		container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
		setPendingNewMessages(false);
	};

	return (
		<div className="relative flex flex-col w-full max-w-full xl:max-w-[26rem] h-[520px] md:h-[580px] mx-auto bg-linear-to-br from-stone-950 via-stone-900 to-stone-950/95 rounded-[2rem] shadow-2xl border border-stone-700 overflow-hidden">
			<div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-emerald-400/40" />
			<ChatHeader />
			<div
				ref={messageContainerRef}
				className="flex-1 overflow-y-auto p-4 bg-stone-950/95">
				<ChatMessages messages={messages} />
			</div>
			{pendingNewMessages && (
				<button
					className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full bg-emerald-500/95 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg ring-1 ring-stone-700 hover:bg-emerald-400"
					onClick={scrollToBottom}>
					New messages
				</button>
			)}
			<ChatInput onSendMessage={sendMessage} />
		</div>
	);
}
