import { requestFetch } from '$lib/utils/fetch.utils';

export async function deleteVaccineReportHandler(id: string) {
	const result = await requestFetch(`/api/vaccine/reports/${id}`, {
		method: 'DELETE'
	});

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
}
