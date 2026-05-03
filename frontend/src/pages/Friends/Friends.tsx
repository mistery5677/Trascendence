import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/UserContext"; // Ajusta o caminho se for preciso
import {
	sendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
	getPendingFriendRequests,
	getFriendsList,
	removeFriend,
} from "../../api/friendRequest";
import { ConfirmDialog } from "../../components/index";
import { toastWrapper } from "../../adapters/toastWrapper";
import { getUsers } from "../../api/users"; // Adjust path if needed

type Friends = "list" | "requests" | "add";

export function Friends() {
	const { state } = useAuth();
	const myUserId = state?.user?.id;

	const [activeTab, setActiveTab] = useState<Friends>("list");
	// States to safe from backend
	const [friends, setFriends] = useState<any[]>([]);
	const [requests, setRequests] = useState<any[]>([]);
	const [searchUsername, setSearchUsername] = useState("");

	// New state for dialog
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		friendId?: number;
		username?: string;
	}>({ open: false });

	// Loading protection
	if (!state || !state.user) {
		return <div className="text-white text-center mt-20">A carregar perfil...</div>;
	}

	// Handle the friend request button
	const handleAddFriend = async (username: string) => {
		try {
			await sendFriendRequest(username);
			toastWrapper.success(`Friend request sent to ${username}`);
		} catch (error: any) {
			toastWrapper.warn(error.message || "Error sending friend request");
		}
	};

	// Handle the accept friend request button
	const handleAccept = async (senderId: number) => {
		try {
			await acceptFriendRequest(senderId);
			// Allows to always have the pending request updated.
			setRequests((actualRequest) => actualRequest.filter((req) => req.senderId !== senderId));
			alert("Friend request accepted!");
		} catch (error) {
			alert("Error accepting friend request.");
		}
	};

	// Handle the decline friend request button
	const handleDecline = async (senderId: number) => {
		try {
			await declineFriendRequest(senderId);
			// Allows to always have the pending request updated.
			setRequests((actualRequest) => actualRequest.filter((req) => req.senderId !== senderId));
		} catch (error) {
			alert("Error declining friend request.");
		}
	};

	// Handle the remove friend from the list
	const handleRemoveFriend = (friendId: number, username: string) => {
		setConfirmDialog({ open: true, friendId, username });
	};

	const handleConfirmRemove = async () => {
		if (!confirmDialog.friendId || !confirmDialog.username) return;
		try {
			await removeFriend(confirmDialog.friendId);
			setFriends((prev) => prev.filter((f) => f.id !== confirmDialog.friendId));
		} catch (error) {
			alert("Error removing friend.");
		} finally {
			setConfirmDialog({ open: false });
		}
	};

	// Updates automatically the friend request list, when we accept or decline
	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const data = await getPendingFriendRequests();
				setRequests(data); // Fill the request list with the backend
			} catch (error) {
				console.error("Failed to load the friend request:", error);
			}
		};

		fetchRequests();
		if (activeTab === "list") {
			// Loads the friends list
			const fetchFriendsList = async () => {
				try {
					const data = await getFriendsList();
					setFriends(data);
				} catch (error) {
					console.error("Failed to get the friends list: ", error);
				}
			};

			fetchFriendsList();
		}
	}, [activeTab]); // If the activeTab change we just update the request list

	const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchUsername(value);
		if (value.trim().length > 0) {
			try {
				const users = await getUsers(value.trim());
				setSuggestions(users.slice(0, 5));
				setShowSuggestions(true);
			} catch {
				setSuggestions([]);
				setShowSuggestions(false);
			}
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

	const handleBlur = () => {
		setTimeout(() => setShowSuggestions(false), 100);
	};

	const [suggestions, setSuggestions] = useState<any[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="max-w-4xl mx-auto mt-10 p-8 bg-slate-900/80 text-white rounded-3xl shadow-2xl border border-emerald-500/20 backdrop-blur-md">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
					Friends Hub
				</h1>
			</div>

			{/* NAVIGATION TABS */}
			<div className="flex gap-6 mb-8 border-b border-slate-700 pb-3 text-xl">
				<button
					onClick={() => setActiveTab("list")}
					className={`pb-2 transition-all duration-300 ${activeTab === "list" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-slate-400 hover:text-stone-200"}`}>
					My Friends
				</button>
				<button
					onClick={() => setActiveTab("requests")}
					className={`pb-2 transition-all duration-300 relative ${activeTab === "requests" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-slate-400 hover:text-stone-200"}`}>
					Pending Requests
					{/* NOTIFICATION RED CIRCLE */}
					{requests.length > 0 && (
						<span className="absolute -top-1 -right-4 size-3 rounded-full bg-red-500 animate-pulse" />
					)}
				</button>
				<button
					onClick={() => setActiveTab("add")}
					className={`pb-2 transition-all duration-300 ${activeTab === "add" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-slate-400 hover:text-stone-200"}`}>
					Add Friend
				</button>
			</div>

			{/* TAB 1: FRIENDS LIST */}
			{activeTab === "list" && (
				<div className="space-y-4">
					{friends.length === 0 ? (
						<p className="text-slate-400 text-center py-10 text-xl">
							You don't have any friends yet. Go to 'Add Friend' to find some rivals!
						</p>
					) : (
						friends.map((friend, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">
										<img
											className="rounded-full"
											src={friend.avatarUrl}
											alt="Avatar Photo"
										/>
									</div>
									<div>
										<p className="font-bold text-lg text-stone-200">{friend.username}</p>
										<p className="text-sm text-emerald-400">ELO: {friend.elo}</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button className="px-4 py-2 text-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-bold transition-all">
										Play ⚔️
									</button>
									<button
										onClick={() => handleRemoveFriend(friend.id, friend.username)}
										className="px-3 py-2 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"
										title="Remove Friend">
										<span className="text-xl text-white">Unfriend</span>
									</button>
								</div>
							</div>
						))
					)}
				</div>
			)}

			{/* TAB 2: PENDING REQUESTS */}
			{activeTab === "requests" && (
				<div className="space-y-4">
					{requests.length === 0 ? (
						<p className="text-slate-400 text-xl text-center py-10">No pending requests.</p>
					) : (
						requests.map((req, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
										<img
											className="rounded-full"
											src={req.sender.avatarUrl}
											alt="Avatar Image"
										/>
									</div>
									<p className="font-bold text-stone-200 text-lg">
										<span className="text-emerald-400">{req.sender.username}</span>
										<span className="text-slate-400 font-normal"> sent you a friend request!</span>
									</p>
								</div>
								<div className="sm:flex flex-row gap-3">
									<button
										onClick={() => handleAccept(req.senderId)}
										className="px-4 py-2 text-xl bg-emerald-500 hover:bg-emerald-400 hover:text-white text-slate-900 rounded-lg font-bold transition-all">
										Accept
									</button>
									<button
										onClick={() => handleDecline(req.senderId)}
										className="px-4 py-2 text-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all">
										Decline
									</button>
								</div>
							</div>
						))
					)}
				</div>
			)}

			{/* TAB 3: ADD FRIENDS */}
			{activeTab === "add" && (
				<div className="max-w-md mx-auto py-8">
					<div className="flex flex-col gap-4">
						<label className="text-sm font-bold text-slate-400 uppercase tracking-widest">
							Search by Username
						</label>
						<div className="flex gap-2 items-center bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 focus-within:border-emerald-400 transition-all shadow-inner relative">
							<span className="pl-2 pr-1 text-emerald-400 text-xl">@</span>
							<input
								ref={inputRef}
								type="text"
								placeholder="Enter username..."
								value={searchUsername}
								onChange={handleUsernameChange}
								onBlur={handleBlur}
								className="flex-1 p-3 bg-transparent border-none focus:outline-none text-white placeholder:text-slate-500 text-base"
								autoComplete="off"
							/>
							<button
								onClick={() => handleAddFriend(searchUsername)}
								className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-lg text-base shadow-md transition-all disabled:opacity-50"
								disabled={!searchUsername.trim()}
								title="Send Friend Request">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-5 h-5">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Send
							</button>
							{showSuggestions && suggestions.length > 0 && (
								<ul className="absolute left-10 top-full mt-1 w-[calc(100%-2.5rem)] bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-10 max-h-56 overflow-auto">
									{suggestions.map((user) => (
										<li
											key={user.id}
											className="px-4 py-2 hover:bg-emerald-500/20 cursor-pointer text-white flex items-center gap-2"
											onMouseDown={() => {
												setSearchUsername(user.username);
												setShowSuggestions(false);
											}}>
											{user.avatarUrl && (
												<img
													src={user.avatarUrl}
													alt="avatar"
													className="w-6 h-6 rounded-full"
												/>
											)}
											<span>{user.username}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			)}
			<ConfirmDialog
				open={confirmDialog.open}
				title="Remove Friend"
				message={`Are you sure you want to remove ${confirmDialog.username} from your friends?`}
				onConfirm={handleConfirmRemove}
				onCancel={() => setConfirmDialog({ open: false })}
			/>
		</div>
	);
}
