import type { DiseaseReportPost, DiseaseReport } from '$lib/models/disease/disease.schema';
import { Routes } from '$lib/models/navigation/routes';
import { requestFetch } from '$lib/utils/fetch.utils';

export const createDiseaseReportHandler = async (
	payload: DiseaseReportPost
): Promise<DiseaseReport> => {
	const result = await requestFetch(Routes.DiseaseReportsApi, {
		method: 'POST',
		body: JSON.stringify(payload)
	});

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	return result.json();
};
