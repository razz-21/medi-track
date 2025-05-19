import type { PatientPost } from '$lib/models/patients/patient.type';
import { requestFetch } from '$lib/utils/fetch.utils';
import { Routes } from '$lib/models/navigation/routes';

export async function createPatienthandler(patientData: PatientPost) {
	const response = await requestFetch(Routes.PatientsApi, {
		method: 'POST',
		body: JSON.stringify({ patient: patientData })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
}
