import type { PageServerLoad } from './$types';
import type { User } from '$lib/models/user/user.type';

export const load: PageServerLoad = async ({ locals }) => {
	const user = (locals as unknown as { user: User }).user;

	return {
		user
	};
};
