import { writable } from 'svelte/store';
import type { Patient } from '$lib/models/patients/patient.type';

export const patientsStore = writable<Patient[]>([]);

export const setPatients = (patients: Patient[]) => {
	patientsStore.set(patients);
};
