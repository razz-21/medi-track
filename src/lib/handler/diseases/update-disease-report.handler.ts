import { Routes } from '$lib/models/navigation/routes';
import type { DiseaseReportGet, DiseaseReportPatch } from '$lib/models/disease/disease.schema';

export const updateDiseaseReportHandler = async (
	id: string,
	payload: DiseaseReportPatch
): Promise<DiseaseReportGet> => {
	const response = await fetch(`${Routes.DiseaseReportsApi}/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
};
