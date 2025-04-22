import { Routes } from '$lib/models/navigation/routes';
import type { VaccineReportsTableParams } from '$lib/models/vaccine/vaccine.schema';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function getVaccinReportsTable(params: VaccineReportsTableParams) {
	const searchParams = new URLSearchParams({
		...(params.type ? { type: params.type } : {}),
		...(params.page ? { page: params.page.toString() } : {}),
		...(params.limit ? { limit: params.limit.toString() } : {}),
		...(params.q ? { q: params.q } : {})
	});

	const result = await requestFetch(`${Routes.VaccineReportsApi}?${searchParams.toString()}`, {
		method: 'GET'
	});

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
}
