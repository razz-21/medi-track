import { Routes } from '$lib/models/navigation/routes';
import { requestFetch } from '$lib/utils/fetch.utils';
import {
	type DashboardStatsGet,
	type DashboardStatsGetParams
} from '$lib/models/dashboard/dashboard.schema';

export async function getDashboardStatsHandler(
	params: DashboardStatsGetParams
): Promise<DashboardStatsGet> {
	const queryParams = new URLSearchParams({
		...(params.from && { from: params.from }),
		...(params.to && { to: params.to })
	});

	const result = await requestFetch(`${Routes.DashboardStatsApi}?${queryParams.toString()}`, {
		method: 'GET'
	});

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
}
