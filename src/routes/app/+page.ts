import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { Routes } from '$lib/models/navigation/routes';

export const load: PageLoad = async () => {
	redirect(302, Routes.Dashboard);
};
