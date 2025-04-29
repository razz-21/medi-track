import { Routes } from '$lib/models/navigation/routes';
import type { PatientPatch, PatientGet } from '$lib/models/patients/patient.type';
import { requestFetch } from '$lib/utils/fetch.utils';

export async function updatePatient(id: string, patient: PatientPatch): Promise<PatientGet> {
	const response = await requestFetch(`${Routes.PatientsApi}/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(patient)
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
}
