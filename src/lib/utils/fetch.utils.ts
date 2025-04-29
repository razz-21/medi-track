import { AUTH_STORAGE_KEY } from '$lib/models/common/constants';

export async function requestFetch(url: string, options: RequestInit = {}) {
	const token = localStorage.getItem(AUTH_STORAGE_KEY);
	return fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${token}`
		}
	});
}
