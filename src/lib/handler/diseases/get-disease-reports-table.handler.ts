import type { DiseaseReportTableParams } from '$lib/models/disease/disease.schema';
import { Routes } from '$lib/models/navigation/routes';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function getDiseaseReportsTable(params: DiseaseReportTableParams) {
	const searchParams = new URLSearchParams({
		...(params.type ? { type: params.type } : {}),
		...(params.page ? { page: params.page.toString() } : {}),
		...(params.limit ? { limit: params.limit.toString() } : {}),
		...(params.q ? { q: params.q } : {})
	});

	const result = await requestFetch(`${Routes.DiseaseReportsApi}?${searchParams.toString()}`, {
		method: 'GET'
	});

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
}
