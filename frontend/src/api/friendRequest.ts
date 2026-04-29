// Send the friend request for the targetUsername
export async function sendFriendRequest(targetUsername: string) {
    const token = localStorage.getItem('token'); 

    const response = await fetch('./api/FriendRequest/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
            targetUsername: targetUsername 
        })
    });

    // If we get a bad response
    if (response.ok == false) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro desconhecido ao adicionar amigo.");
    }

    return await response.json();
}

//