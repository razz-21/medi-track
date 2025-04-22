import { requestFetch } from '$lib/utils/fetch.utils';
import type { VaccineReportGet } from '$lib/models/vaccine/vaccine.schema';

export async function getVaccineReport(id: string): Promise<VaccineReportGet> {
	const result = await requestFetch(`/api/vaccine/reports/${id}`);

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
}
