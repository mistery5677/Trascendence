import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext"; // Ajusta o caminho se for preciso
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getPendingFriendRequests, getFriendsList, removeFriend } from "../../api/friendRequest";

type Friends = "list" | "requests" | "add";

export function Friends() {
    const { state } = useAuth();
    const myUserId = state?.user?.id;

    const [activeTab, setActiveTab] = useState<Friends>("list");
    
    // States to safe from backend
    const [friends, setFriends] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [searchUsername, setSearchUsername] = useState("");

    // Loading protection
    if (!state || !state.user) {
        return <div className="text-white text-center mt-20">A carregar perfil...</div>;
    }

    // Handle the friend request button
    const handleAddFriend = async (username: string) => {
        try {
            await sendFriendRequest(username);
            alert(`Friend request sent to ${username}!`); 
        } catch (error: any) {
            alert(error.message || 'Error sending the friend request');
        }
    }

    // Handle the accept friend request button
    const handleAccept = async (senderId: number) => {
        try {
            await acceptFriendRequest(senderId);
            // Allows to allways have the pending request updated.
            setRequests((actualRequest) => actualRequest.filter(req => req.senderId !== senderId));
            alert('Friend request accepted!');
        } catch (error) {
            alert('Error accepting friend request.');
        }
    };

    // Handle the decline friend request button
    const handleDecline = async (senderId: number) => {
        try {
            await declineFriendRequest(senderId);
            // Allows to allways have the pending request updated.
            setRequests((actualRequest) => actualRequest.filter(req => req.senderId !== senderId));
        } catch (error) {
            alert('Error declining friend request.');
        }
    };
    
    // Handle the remove friend from the list
    const handleRemoveFriend = async (friendId: number, username: string) => {
        if (!confirm(`Are you sure you want to remove ${username} from your friends?`)) return;

        try {
            await removeFriend(friendId);
            // Update the friends list after you remove the friend
            setFriends((prev) => prev.filter(f => f.id !== friendId));
        } catch (error) {
            alert("Error removing friend.");
        }
    };

    // Updates automatically the friend request list, when we accept or decline
    useEffect(() => {
        if (activeTab === "requests") {
            // Loads the friends request
            const fetchRequests = async () => {
                try {
                    const data = await getPendingFriendRequests();
                    setRequests(data); // Fill the request list with the backend
                } catch (error) {
                    console.error("Failed to load the friend request:", error);
                }
            };

            fetchRequests();
        }

        else if (activeTab === "list") {
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

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-slate-900/80 text-white rounded-3xl shadow-2xl border border-emerald-500/20 backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
                    Friends Hub
                </h1>
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex gap-6 mb-8 border-b border-slate-700 pb-3">
                <button 
                    onClick={() => setActiveTab("list")}
                    className={`pb-2 transition-all duration-300 ${activeTab === "list" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-slate-400 hover:text-stone-200"}`}
                >
                    My Friends
                </button>
                <button 
                    onClick={() => setActiveTab("requests")}
                    className={`pb-2 transition-all duration-300 relative ${activeTab === "requests" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-slate-400 hover:text-stone-200"}`}
                >
                    Pending Requests
                    {/* NOTIFICATION RED CIRCLE */}
                    {requests.length > 0 && (
                        <span className="absolute -top-1 -right-4 size-3 rounded-full bg-red-500 animate-pulse" />
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab("add")}
                    className={`pb-2 transition-all duration-300 ${activeTab === "add" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-slate-400 hover:text-stone-200"}`}
                >
                    Add Friend
                </button>
            </div>

            {/* TAB 1: FRIENDS LIST */}
            {activeTab === "list" && (
                <div className="space-y-4">
                    {friends.length === 0 ? (
                        <p className="text-slate-400 text-center py-10">You don't have any friends yet. Go to 'Add Friend' to find some rivals!</p>
                    ) : (
                        friends.map((friend, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">👤</div>
                                    <div>
                                        <p className="font-bold text-lg text-stone-200">{friend.username}</p>
                                        <p className="text-sm text-emerald-400">ELO: {friend.elo}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-bold transition-all">
                                        Play ⚔️
                                    </button>
                                    <button 
                                        onClick={() => handleRemoveFriend(friend.id, friend.username)}
                                        className="px-3 py-2 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"
                                        title="Remove Friend"
                                    >
                                        <span className="text-sm">Unfriend</span>
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
                        <p className="text-slate-400 text-center py-10">No pending requests.</p>
                    ) : (
                        requests.map((req, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">👤</div>
                                    <p className="font-bold text-stone-200">User ID: {req.senderId} wants to be your friend!</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAccept(req.senderId)}
                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-bold transition-all">
                                        Accept
                                    </button>
                                    <button 
                                        onClick={() => handleDecline(req.senderId)}
                                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all">
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
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Search by Username</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Enter username..." 
                                value={searchUsername}
                                onChange={(e) => setSearchUsername(e.target.value)}
                                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-white transition-all"
                            />
                            <button
                                onClick={() => handleAddFriend(searchUsername)} // Handle the press button 
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all">
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}