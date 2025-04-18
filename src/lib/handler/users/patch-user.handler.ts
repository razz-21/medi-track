import type { UserPatch } from '$lib/models/user/user.type';

export async function patchUserHandler(id: string, user: UserPatch) {
	const response = await fetch(`/api/user/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(user)
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
