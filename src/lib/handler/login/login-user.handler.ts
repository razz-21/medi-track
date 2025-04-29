import type { AuthLogin } from '$lib/models/authentication/authentication.type';

export async function loginUserHandler(payload: AuthLogin) {
	const result = await fetch('/api/login', {
		method: 'POST',
		body: JSON.stringify(payload)
	});

	if (!result.ok) {
		if (result.status === 401) {
			const error = await result.json();
			throw new Error(error.message);
		}
		throw new Error('Failed to login');
	}

	return result.json();
}
