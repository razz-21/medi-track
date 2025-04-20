import {
	type PatientGetTable,
	type PatientGetTableParams
} from '$lib/models/patients/patient.type';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function getPatientTableHandler(
	params: PatientGetTableParams
): Promise<PatientGetTable> {
	const searchParams = new URLSearchParams({
		page: params.page.toString(),
		limit: params.limit.toString(),
		...(params.q ? { q: params.q } : {})
	});

	const response = await requestFetch(`/api/patients?${searchParams}`);

	if (!response.ok) {
		throw new Error('Failed to fetch patients');
	}

	return response.json();
}
