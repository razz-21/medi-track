import { Routes } from '$lib/models/navigation/routes';
import { requestFetch } from '$lib/utils/fetch.utils';
import { type DashboardGet } from '$lib/models/dashboard/dashboard.schema';

export const getDashboardHandler = async (): Promise<DashboardGet> => {
	const response = await requestFetch(Routes.DashboardApi);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
};
