import { useEffect, useRef, useState } from "react";
import { acceptFriendRequest, getFriendsList } from "../../api/friendRequest";
import { SendToBack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext/ChatContext";

function ShowFriendList({ onSelectFriend }: { onSelectFriend: (friend: any) => void }) {
	const [friends, setFriends] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFriend = async () => {
			try {
				const data = await getFriendsList();
				setFriends(data);
			} catch (error) {
				console.error("Failed to get the friends list: ", error);
			} finally {
				setLoading(false);
			}
		};
		fetchFriend();
	}, []);

	return (
		<div className="w-full h-full overflow-y-auto p-1">
			<h3 className="text-xs font-bold text-stone-400 mb-2 tracking-wider">Friend List</h3>
			{loading ? (
				<p className="text-center text-xs text-stone-500 pt-4">Loading...</p>
			) : friends.length === 0 ? (
				<div className="flex flex-col items-center justify-center w-full pt-4">
					<p className="text-center text-xs text-stone-500">No friend found.</p>
					<button
						onClick={() => navigate("/friends")}
						className="mt-2 mx-auto rounded-lg bg-button-green px-4 py-1.5 text-xs text-white font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none cursor-pointer text-center">
						Add friends
					</button>
				</div>
			) : (
				<div>
					{friends.map((friend) => (
						<div
							key={friend.id}
							onClick={() => onSelectFriend(friend)}
							className="flex items-center gap-2 text-xs p-1.5 bg-stone-700 hover:bg-stone-650 rounded text-stone-200 mb-1">
							<img
								src={friend.avatarUrl}
								alt={friend.username}
								className="w-6 h-6 rounded-full object-cover bg-stone-600"
							/>
							<div className="flex-1 min-w-0">
								<p className="font-semibold truncate">{friend.username}</p>
								<p className="text-[10px] text-emerald-400">ELO: {friend.elo}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function ActiveChatBox({ activeChat }: { activeChat: any }) {
	const { privateChats, sendPrivateMessage, setActiveChatUserId, loadChatHistory } = useChat();
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		let isMounted = true;

		if (activeChat?.id) {
			setActiveChatUserId(activeChat.id);
			if (isMounted) {
				loadChatHistory(activeChat.id);
			}
		}
		return () => {
			isMounted = false;
			setActiveChatUserId(null);
		};
	}, [activeChat?.id, setActiveChatUserId, loadChatHistory]);

	const chatMessages = privateChats[String(activeChat.id)] || [];
	console.log("ActiveChatBox", privateChats[String(activeChat.id)], activeChat.id);
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages]);

	const handleSend = () => {
		if (!input.trim()) return;
		sendPrivateMessage(activeChat.id, input.trim());
		setInput("");
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex flex-col h-full w-full bg-stone-950/95 justify-between overflow-hidden">
			<div className="flex-1 overflow-y-auto p-2 space-y-2 flex flex-col">
				<p className="text-[10px] text-stone-500 text-center my-1">Connected with {activeChat.username}</p>

				{chatMessages.length === 0 ? (
					<p className="text-[10px] text-stone-600 text-center mt-4 italic">No messages yet...</p>
				) : (
					chatMessages.map((msg, index) => {
						const isFriend = String(msg.fromId) === String(activeChat.id);
						return (
							<div
								key={index}
								className={`rounded-xl border p-2 text-left max-w-[85%] ${
									!isFriend
										? "bg-emerald-950/60 border-emerald-800/60 self-end text-emerald-200"
										: "bg-stone-800 border-stone-700 self-start text-stone-200"
								}`}>
								<div className="flex items-center justify-between gap-2 text-[9px] text-stone-400 font-medium">
									<span className={!isFriend ? "text-emerald-400" : "text-stone-300"}>
										{!isFriend ? "You" : msg.fromUsername || activeChat.username}
									</span>
									<span>
										{msg.timestamp
											? new Date(msg.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})
											: ""}
									</span>
								</div>
								<p className="mt-0.5 text-xs leading-tight break-words">{msg.message}</p>
							</div>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className="bg-stone-900 border-t border-stone-700 p-1.5">
				<div className="flex items-center gap-1.5 rounded-2xl bg-stone-800 p-1 shadow-inner">
					<input
						type="text"
						className="flex-1 min-w-0 h-7 text-xs rounded-2xl bg-stone-950 px-2 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
						placeholder="Message..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button
						type="button"
						onClick={handleSend}
						className="inline-flex h-7 px-3 items-center justify-center rounded-2xl bg-emerald-500 text-[11px] font-bold text-stone-950 transition hover:bg-emerald-400 focus:outline-none cursor-pointer">
						Send
					</button>
				</div>
			</div>
		</div>
	);
}

export function FloatingChatContainer() {
	const [isOpen, setIsOpen] = useState(false);
	const [showFriends, setShowFriends] = useState(false);
	const [activeChat, setActiveChat] = useState<any | null>(null);

	const handleSelectFriend = (friend: any) => {
		setActiveChat(friend);
		setShowFriends(false);
	};

	return (
		<div className="fixed bottom-4 z-50 right-4">
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="flex h-14 w-14 cursor-pointer items-center justify-center">
					💬
				</button>
			)}
			{/* Header */}
			{isOpen && (
				<div className=" bg-stone-800 w-48 h-48 text-white flex flex-col justify-between rounded-lg shadow-lg overflow-hidden">
					<div className="flex items-center justify-between bg-stone-800 p-2 border-b border-stone-600">
						<span className="text-xs font-bold text-white uppercase tracking-wide">Chat</span>
						{!showFriends ? (
							<button
								onClick={() => setShowFriends(true)}
								className="text-stone-400 hover:text-black font-bold text-xs cursor-pointer">
								New Chat +
							</button>
						) : (
							<button
								onClick={() => setShowFriends(false)}
								className="text-stone-400 hover:text-white font-medium text-[11px] cursor-pointer">
								⬅ Back
							</button>
						)}
						<button
							onClick={() => setIsOpen(false)}
							className="text-stone-400 hover:text-black font-bold text-xs cursor-pointer">
							✖
						</button>
					</div>
					{/* Body */}
					<div className="flex-1 flex items-center justify-center">
						{showFriends ? (
							<ShowFriendList onSelectFriend={handleSelectFriend} />
						) : activeChat ? (
							<ActiveChatBox activeChat={activeChat} />
						) : (
							<p className="text-xs text-stone-400 text-center">No active chats.</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
