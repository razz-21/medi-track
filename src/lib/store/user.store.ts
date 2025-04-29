import { get, writable } from 'svelte/store';
import { UserTypeEnum, type User } from '$lib/models/user/user.type';

export const userStore = writable<User | null>(null);

export const setUser = (user: User | null) => {
	userStore.set(user);
};

export const updateUser = (user: Partial<User>) => {
	userStore.update((state) => ({ ...state, ...user }) as User);
};

export const isUserAdmin = () => {
	const user = get(userStore);
	return user?.role === UserTypeEnum.Admin;
};

export const isUserEncoder = () => {
	const user = get(userStore);
	return user?.role === UserTypeEnum.Encoder;
};
