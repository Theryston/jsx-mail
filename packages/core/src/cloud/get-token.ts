import getStorage from "../utils/storage";

export function getToken() {
	const storage = getStorage();
	const token = storage.getItem('token');
	return token;
}