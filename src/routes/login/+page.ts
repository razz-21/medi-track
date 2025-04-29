import type { PageLoad } from './$types';
import { AUTH_STORAGE_KEY } from '$lib/models/common/constants';
import { goto } from '$app/navigation';
import { Routes } from '$lib/models/navigation/routes';
import { browser } from '$app/environment';

export const load: PageLoad = async () => {
	if (browser && localStorage?.getItem(AUTH_STORAGE_KEY)) {
		goto(Routes.App);
	}
};
