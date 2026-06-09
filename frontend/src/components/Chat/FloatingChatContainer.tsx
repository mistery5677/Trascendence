import { useState, useRef, useEffect } from "react";
import { userChat } from "../../contexts/ChatContext/ChatContext";
import { useAuth } from "../../contexts/UserContext";
import { getFriendsList } from "../../api/friendRequest"; // 1. Importamos la API de amigos

export function FloatingChatContainer() {
	const { privateChats, sendPrivateMessage, activeChatUserId, setActiveChatUserId } = userChat();
	const { state: authState } = useAuth();
	const [text, setText] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	// Estados nuevos para controlar la lista de amigos en el chat
	const [isChoosingFriend, setIsChoosingFriend] = useState(false);
	const [friends, setFriends] = useState<any[]>([]);
	const [loadingFriends, setLoadingFriends] = useState(false);

	const messageEndRef = useRef<HTMLDivElement>(null);

	const currentUserId = authState.user?.id ? String(authState.user.id) : null;
	const activeMessages = activeChatUserId ? privateChats[activeChatUserId] || [] : [];

	// Auto-scroll al fondo al recibir mensajes
	useEffect(() => {
		if (isOpen && messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [activeMessages, isOpen, activeChatUserId]);

	// Cargar amigos cuando se abre el modal de "New Chat"
	const handleOpenNewChat = async () => {
		setIsChoosingFriend(true);
		setLoadingFriends(true);
		try {
			const data = await getFriendsList();
			setFriends(data);
		} catch (error) {
			console.error("Error al cargar la lista de amigos para MP:", error);
		} finally {
			setLoadingFriends(false);
		}
	};

	if (!currentUserId) {
		return null;
	}

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim() || !activeChatUserId) return;

		sendPrivateMessage(activeChatUserId, text.trim());
		setText("");
	};

	const toggleChatWindow = (targetState: boolean) => {
		setIsOpen(targetState);
		// Resetear vistas al cerrar el chat
		if (!targetState) {
			setIsChoosingFriend(false);
		}
	};

	const selectConversation = (userId: string | null) => {
		setActiveChatUserId(userId);
		setIsChoosingFriend(false); // Cerramos el menú de selección si se escoge uno
	};

	return (
		<div className="fixed bottom-4 right-4 z-50 font-sans text-white">
			{/* Botón Flotante para abrir todo el Chat */}
			{!isOpen && (
				<button
					onClick={() => toggleChatWindow(true)}
					className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-emerald-600 shadow-lg transition-transform hover:scale-105 hover:bg-emerald-500">
					💬
				</button>
			)}

			{/* Ventana de Consola del Chat */}
			{isOpen && (
				<div className="flex h-96 w-80 flex-col overflow-hidden rounded-lg bg-stone-900 border border-stone-700 shadow-2xl">
					{/* Header del Chat */}
					<div className="flex items-center justify-between bg-stone-800 p-3 border-b border-stone-700">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-green-500"></span>
							<h3 className="text-sm font-bold truncate max-w-[180px]">
								{isChoosingFriend
									? "Select a Friend"
									: activeChatUserId
										? `Chat with User ID: ${activeChatUserId}`
										: "Private Messaging"}
							</h3>
						</div>
						<button
							onClick={() => toggleChatWindow(false)}
							className="cursor-pointer text-stone-400 hover:text-white text-sm">
							✖
						</button>
					</div>

					{/* Viewport Principal con Scrolling */}
					<div className="flex-1 overflow-y-auto p-3 space-y-2">
						{/* MODO 1: SELECCIONAR UN AMIGO PARA ENVIAR NUEVO MP */}
						{isChoosingFriend ? (
							<div className="space-y-1">
								<div className="flex items-center justify-between p-1 mb-1">
									<span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
										Your Friends
									</span>
									<button
										onClick={() => setIsChoosingFriend(false)}
										className="text-[11px] text-emerald-400 hover:underline cursor-pointer">
										Cancel
									</button>
								</div>
								{loadingFriends ? (
									<p className="text-center text-xs text-stone-500 pt-10">Loading friends...</p>
								) : friends.length === 0 ? (
									<p className="text-center text-xs text-stone-500 pt-10">
										You don't have friends added yet.
									</p>
								) : (
									friends.map((friend) => (
										<button
											key={friend.id}
											onClick={() => selectConversation(String(friend.id))}
											className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-stone-800 text-left cursor-pointer transition-colors border border-transparent hover:border-white/5">
											<img
												src={friend.avatarUrl}
												alt={friend.username}
												className="w-7 h-7 rounded-full bg-stone-700 object-cover"
											/>
											<div className="flex-1 min-w-0">
												<div className="text-xs font-bold text-stone-200 truncate">
													{friend.username}
												</div>
												<div className="text-[10px] text-emerald-400 font-medium">
													ELO: {friend.elo}
												</div>
											</div>
											<span className="text-stone-500 text-xs">✉️</span>
										</button>
									))
								)}
							</div>
						) : activeChatUserId ? (
							/* MODO 2: CONVERSACIÓN PRIVADA ACTIVA */
							activeMessages.length === 0 ? (
								<p className="text-center text-xs text-stone-500 pt-10">
									No message history found. Start the conversation!
								</p>
							) : (
								activeMessages.map((msg, idx) => {
									const isMe = String(msg.senderId) === currentUserId;
									return (
										<div
											key={idx}
											className={`flex flex-col max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}>
											<div
												className={`rounded-lg px-3 py-1.5 text-xs ${
													isMe
														? "bg-emerald-600 text-white rounded-br-none"
														: "bg-stone-800 text-stone-200 rounded-bl-none"
												}`}>
												<p className="break-all">{msg.text}</p>
											</div>
											<span className="text-[10px] text-stone-500 mt-0.5 px-1">
												{msg.timestamp}
											</span>
										</div>
									);
								})
							)
						) : (
							/* MODO 3: BANDEJA DE ENTRADA CENTRAL (LISTA DE CHATS EXISTENTES) */
							<div className="space-y-2">
								{/* Botón estilizado e integrado correctamente dentro de la UI del chat */}
								<div className="flex justify-end pr-1 pb-1">
									<button
										onClick={handleOpenNewChat}
										className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-button-green bg-button-green px-3 py-1.5 text-white shadow-md shadow-button-green/30 transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none"
										title="Start a new message thread">
										<span className="text-[11px] font-extrabold tracking-wider uppercase">
											New Chat
										</span>
										<span className="text-xs font-bold font-sans">+</span>
									</button>
								</div>

								<p className="text-[11px] uppercase font-bold text-stone-500 px-1 tracking-wider">
									Active Chats
								</p>

								{Object.keys(privateChats).length === 0 ? (
									<p className="text-xs text-stone-400 p-4 text-center">
										Select an active peer connection from your friends list to initialize messaging.
									</p>
								) : (
									<div className="space-y-1">
										{Object.keys(privateChats).map((userId) => (
											<button
												key={userId}
												onClick={() => selectConversation(userId)}
												className="w-full flex items-center justify-between p-2 rounded hover:bg-stone-800 text-left cursor-pointer transition-colors">
												<div className="text-xs font-semibold">User #{userId}</div>
												<div className="text-[10px] text-stone-500 max-w-[50%] truncate">
													{privateChats[userId].slice(-1)[0]?.text || ""}
												</div>
											</button>
										))}
									</div>
								)}
							</div>
						)}
						<div ref={messageEndRef} />
					</div>

					{/* Formulario de envío (solo visible si estás chateando con alguien) */}
					{activeChatUserId && !isChoosingFriend && (
						<form
							onSubmit={handleSend}
							className="flex border-t border-stone-700 bg-stone-850 p-2 gap-2">
							<input
								type="text"
								value={text}
								onChange={(e) => setText(e.target.value)}
								placeholder="Type a private message..."
								className="flex-1 rounded bg-stone-800 border border-stone-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
							/>
							<button
								type="submit"
								className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded cursor-pointer transition-colors">
								Send
							</button>
						</form>
					)}

					{/* Botón de retorno al Inbox central */}
					{activeChatUserId && !isChoosingFriend && (
						<button
							onClick={() => selectConversation(null)}
							className="text-center text-[11px] bg-stone-800 text-stone-400 hover:text-white py-1 cursor-pointer transition-colors border-t border-stone-700">
							⬅ Return to Inbox
						</button>
					)}
				</div>
			)}
		</div>
	);
}
