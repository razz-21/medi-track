import { AUTH_STORAGE_KEY } from '$lib/models/common/constants';

export function isAuthenticated() {
	const user = localStorage.getItem(AUTH_STORAGE_KEY);
	return user !== null;
}
