import { Routes } from '$lib/models/navigation/routes';

export const deleteDiseaseReportHandler = async (id: string) => {
	const response = await fetch(`${Routes.DiseaseReportsApi}/${id}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
};
