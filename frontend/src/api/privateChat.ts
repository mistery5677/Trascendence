export async function getChatHistory(friendId: string | number): Promise<any[]> {
	const res = await fetch(`/api/chat/${friendId}`, {
		method: "GET",
		credentials: "include",
	});
	if (!res.ok) {
		throw new Error("Failed to fetch chat history");
	}

	return res.json();
}
