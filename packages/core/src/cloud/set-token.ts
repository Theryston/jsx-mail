import getStorage from "../utils/storage";

export function setToken(token: string) {
	const storage = getStorage();
	storage.setItem('token', token);
}