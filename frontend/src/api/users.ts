export async function updatePassword(
  currentPassword: string,
  newPassword: string,
) {
  const res = await fetch("/api/users/me/password", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error("Failed to update password");
}

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
