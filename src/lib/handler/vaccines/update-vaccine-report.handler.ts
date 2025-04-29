import type { VaccineReportPatch } from '$lib/models/vaccine/vaccine.schema';

export async function updateVaccineReportHandler(id: string, payload: VaccineReportPatch) {
	const result = await fetch(`/api/vaccine/reports/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(payload)
	});

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
}
