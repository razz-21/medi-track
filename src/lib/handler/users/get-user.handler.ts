import type { UserGet } from '$lib/models/user/user.type';
import { requestFetch } from '$lib/utils/fetch.utils';
import { goto } from '$app/navigation';
import { Routes } from '$lib/models/navigation/routes';
import { toast } from 'svelte-sonner';

export async function getUserHandler(id: string): Promise<UserGet> {
	const response = await requestFetch(`/api/user/${id}`);

	if (!response.ok) {
		const error = await response.json();

		if (response.status === 404) {
			toast.error('Unable to fetch user data');
			goto(Routes.Users);
		}

		throw new Error(error.message);
	}

	return response.json();
}
