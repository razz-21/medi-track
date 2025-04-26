import { Routes } from '$lib/models/navigation/routes';
import { requestFetch } from '$lib/utils/fetch.utils';
import { type DashboardGet, type DashboardParams } from '$lib/models/dashboard/dashboard.schema';

export const getDashboardHandler = async (params: DashboardParams): Promise<DashboardGet> => {
	const queryParams = new URLSearchParams({
		...(params.year ? { year: params.year.toString() } : {})
	});

	const response = await requestFetch(`${Routes.DashboardApi}?${queryParams.toString()}`, {
		method: 'GET'
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
};
