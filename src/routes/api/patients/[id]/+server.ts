import { PatientSchema } from '$lib/models/patients/patients.schema.js';
import patientsCollection from '$lib/server/mongo/collections/patients.collection';
import { error, json } from '@sveltejs/kit';
import type { Patient, PatientGetWithHistory } from '$lib/models/patients/patient.type';
import { diseaseReportsCollection } from '$lib/server/mongo/collections/diseases.collection.js';
import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection.js';
export const GET = async ({ params }) => {
	const { id } = params;

	const patient = await patientsCollection.findOne({ _id: id });

	if (!patient) {
		return error(404, { message: 'Patient not found' });
	}

	const patientFamilyMembers = !patient.hsn
		? []
		: ((await patientsCollection
				.find({ hsn: patient.hsn })
				.project({ relevant_information: 0 })
				.toArray()) as Patient[]);

	const diseaseHistory = await diseaseReportsCollection.find({ patient_id: id }).toArray();
	const vaccineHistory = await vaccineReportsCollection.find({ patient_id: id }).toArray();

	const response: PatientGetWithHistory = {
		...patient,
		family_members: patientFamilyMembers,
		disease_history: diseaseHistory,
		vaccine_history: vaccineHistory
	};

	return json(response, { status: 200 });
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
