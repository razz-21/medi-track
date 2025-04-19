import type { PageLoad } from './$types';
import { AUTH_STORAGE_KEY } from '$lib/models/common/constants';
import { goto } from '$app/navigation';
import { Routes } from '$lib/models/navigation/routes';

export const load: PageLoad = async () => {
	const userToken = localStorage.getItem(AUTH_STORAGE_KEY);
	if (userToken) {
		goto(Routes.App);
	}
};
