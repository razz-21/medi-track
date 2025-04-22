import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/models/user/user.type';
import { getPatientTableHandler } from '$lib/handler/patients/get-patient-table.handler';
import patientsCollection from '$lib/server/mongo/collections/patients.collection';
import { PatientStatusEnum } from '$lib/models/patients/patient.type';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = (locals as unknown as { user: User }).user;
	const patients = patientsCollection
		.find({
			status: PatientStatusEnum.ACTIVE
		})
		.toArray();

	return {
		user,
		patients
	};
};
