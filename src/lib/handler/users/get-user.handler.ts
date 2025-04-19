import type { UserGet } from '$lib/models/user/user.type';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function getUserHandler(id: string): Promise<UserGet> {
	const response = await requestFetch(`/api/user/${id}`);

	if (!response.ok) {
		throw new Error('Failed to fetch user');
	}

	return response.json();
}
