import {
	type PatientGetTable,
	type PatientGetTableParams
} from '$lib/models/patients/patient.type';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function getPatientTableHandler(
	params: PatientGetTableParams
): Promise<PatientGetTable> {
	const searchParams = new URLSearchParams({
		...(params.page ? { page: params.page.toString() } : {}),
		...(params.limit ? { limit: params.limit.toString() } : {}),
		...(params.q ? { q: params.q } : {})
	});

	const response = await requestFetch(`/api/patients?${searchParams}`);

	if (!response.ok) {
		throw new Error('Failed to fetch patients');
	}

	return response.json();
}
