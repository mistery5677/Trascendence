export const userNameValidation = (username: string): boolean => {
	return /^[a-zA-Z0-9]+$/.test(username);

};
