import type { UserPost } from '$lib/models/user/user.type';

export async function createUserHandler(payload: UserPost) {
	const response = await fetch('/api/user', {
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
