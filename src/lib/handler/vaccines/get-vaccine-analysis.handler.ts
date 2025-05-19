import { requestFetch } from '$lib/utils/fetch.utils';
import type { VaccineAnalysis } from '$lib/models/vaccine/vaccine.schema';

export async function getVaccineAnalysis(): Promise<VaccineAnalysis> {
	const result = await requestFetch(`/api/vaccine/reports/analysis`);

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
}
