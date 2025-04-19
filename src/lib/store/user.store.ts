import { writable } from 'svelte/store';
import type { User } from '$lib/models/user/user.type';

export const userStore = writable<User | null>(null);

export const setUser = (user: User | null) => {
	userStore.set(user);
};

export const updateUser = (user: Partial<User>) => {
	userStore.update((state) => ({ ...state, ...user }) as User);
};
