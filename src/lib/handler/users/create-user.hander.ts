import type { UserPost } from '$lib/models/user/user.type';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function createUserHandler(payload: UserPost) {
	const response = await requestFetch('/api/user', {
		method: 'POST',
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		if (response.status === 400) {
			const errorData = await response.json();
			throw new Error(errorData.message);
		}
		throw new Error('Failed to create user');
	}

	return response.json();
}
