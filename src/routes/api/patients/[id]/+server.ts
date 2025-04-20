import { PatientSchema } from '$lib/models/patients/patients.schema.js';
import patientsCollection from '$lib/server/mongo/collections/patients.collection';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const { id } = params;

	const patient = await patientsCollection.findOne({ _id: id });

	if (!patient) {
		return error(404, { message: 'Patient not found' });
	}

	return json(patient, { status: 200 });
};

export const PATCH = async ({ params, request }) => {
	const { id } = params;
	const patient = await patientsCollection.findOne({ _id: id });

	if (!patient) {
		return error(404, { message: 'Patient not found' });
	}

	const patientPatch = await request.json();
	const payload = {
		...patientPatch,
		relevant_information: {
			...patient.relevant_information,
			...patientPatch.relevant_information
		},
		updated_at: new Date().toISOString()
	};

	await patientsCollection.updateOne({ _id: id }, { $set: payload });

	const updatedPatient = await patientsCollection.findOne({ _id: id });

	return json(updatedPatient, { status: 200 });
};
