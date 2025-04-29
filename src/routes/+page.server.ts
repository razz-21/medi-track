import type { User } from '$lib/models/user/user.type';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user as User;
	if (!user) {
		throw redirect(302, '/login');
	}

	return {
		user
	};
};
