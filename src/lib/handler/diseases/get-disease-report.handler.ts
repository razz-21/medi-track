import type { DiseaseReportGet } from '$lib/models/disease/disease.schema';
import { Routes } from '$lib/models/navigation/routes';

export const getDiseaseReportHandler = async (id: string): Promise<DiseaseReportGet> => {
	const response = await fetch(`${Routes.DiseaseReportsApi}/${id}`);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
};
