import type { UserPatch } from '$lib/models/user/user.type';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function patchUserHandler(id: string, user: UserPatch) {
	const response = await requestFetch(`/api/user/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(user)
	});

	if (!response.ok) {
		if (response.status === 400) {
			const errorData = await response.json();
			throw new Error(errorData.message);
		}
		throw new Error('Failed to update user');
	}

	return response.json();
}
