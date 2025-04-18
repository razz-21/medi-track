export async function getUserHandler(id: string) {
	const response = await fetch(`/api/user/${id}`);

	if (!response.ok) {
		throw new Error('Failed to get user');
	}

	return response.json();
}
