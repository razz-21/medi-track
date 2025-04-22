import { writable } from 'svelte/store';
import type { Patient } from '$lib/models/patients/patient.type';

export const patientsStore = writable<Patient[]>([]);

export const setPatients = (patients: Patient[]) => {
	patientsStore.set(patients);
};

export const updatePatient = (patient: Patient) => {
	patientsStore.update((patients) => {
		return patients.map((p) => (p._id === patient._id ? patient : p));
	});
};
