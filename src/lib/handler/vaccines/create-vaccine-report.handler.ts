import { Routes } from '$lib/models/navigation/routes';
import type { VaccineReportPost } from '$lib/models/vaccine/vaccine.schema';
import { requestFetch } from '$lib/utils/fetch.utils';

export const createVaccineReport = async (vaccineReport: VaccineReportPost) => {
	const result = await requestFetch(Routes.VaccineReportsApi, {
		method: 'POST',
		body: JSON.stringify(vaccineReport)
	});

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
};
