import { UserGetTableSchema } from '$lib/models/user/user.schema';
import { type UserGetTable, type UserGetTableUserParams } from '$lib/models/user/user.type';

export async function getUserTableHandler(params: UserGetTableUserParams): Promise<UserGetTable> {
	const searchParams = new URLSearchParams({
		page: params.page.toString(),
		limit: params.limit.toString(),
		...(params.q ? { q: params.q } : {}),
		...(params.type ? { type: params.type } : {})
	});

	const response = await fetch(`/api/user?${searchParams}`, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error('Failed to fetch users');
	}

	return response.json();
}
