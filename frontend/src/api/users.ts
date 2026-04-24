// Change the password
export async function updatePassword(currentPassword: string, newPassword: string) {
	const res = await fetch("/api/users/me/password", {
		method: "PATCH",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ currentPassword, newPassword }),
	});
	if (!res.ok) throw new Error("Failed to update password");
}

// Updates the provile image
export async function updateAvatar(picture: File) {
	// TODO:Change backend requires formData to work,
	const formData = new FormData();
	formData.append("file", picture);

	const res = await fetch("/api/users/me/avatar", {
		method: "POST",
		credentials: "include",
		body: formData,
	});

	if (!res.ok) throw new Error("Failed to update Avatar");
}

// Check if the username is avilable when we try to create a new account
export async function verifyUsername(username: string): Promise<boolean> {
	const response = await fetch(`/api/users/check-username?username=${username}`);
	if (!response.ok) {
		throw new Error("Failed to check username");
	}
	const data = await response.json();
	return data.isAvailable;
}

// Check if the email is available when we try to create a new account
export async function verifyEmail(email: string): Promise<boolean> {
	const response = await fetch(`/api/users/check-email?email=${email}`);

	if (!response.ok) {
		throw new Error("Failed to verify email");
	}

	const data = await response.json();
	return data.isAvailable;
}

// Function to sign up connecting to api
export async function signupUser(userData: Record<string, any>): Promise<boolean> {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		throw new Error("Failed to sign up user");
	}

	const data = await response.json();
	return data;
}
