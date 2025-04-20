import { goto } from '$app/navigation';
import { Routes } from '$lib/models/navigation/routes.js';
import type { PatientGet } from '$lib/models/patients/patient.type';
import { requestFetch } from '$lib/utils/fetch.utils.js';
import { toast } from 'svelte-sonner';
export async function getPatient(id: string): Promise<PatientGet> {
	const response = await requestFetch(`${Routes.PatientsApi}/${id}`);

	if (!response.ok) {
		const error = await response.json();

		if (response.status === 404) {
			toast.error('Unable to fetch patient data');
			goto(Routes.Patients);
		}

		throw new Error(error.message);
	}

	return response.json();
}
