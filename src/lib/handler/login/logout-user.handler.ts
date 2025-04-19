import { userStore } from '$lib/store/user.store';
import { goto } from '$app/navigation';
import { Routes } from '$lib/models/navigation/routes';
import { AUTH_STORAGE_KEY } from '$lib/models/common/constants';
export const logoutUserHandler = async () => {
	userStore.set(null);
	localStorage.removeItem(AUTH_STORAGE_KEY);
	goto(Routes.Login);
};
