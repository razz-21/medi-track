import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
import { json } from '@sveltejs/kit';
import patientsCollection from '$lib/server/mongo/collections/patients.collection';
import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection';
import type { Patient } from '$lib/models/patients/patient.type';

export const GET = async () => {
	try {
		// Get all patients
		const allPatients = await patientsCollection.find({}).toArray();

		// Get all vaccine reports
		const allVaccineReports = await vaccineReportsCollection.find({}).toArray();

		// Create a map to store patients who haven't been vaccinated for each type
		const unvaccinatedPatients: Record<VaccineTypeEnum, Patient[]> = {
			[VaccineTypeEnum.BCG]: [],
			[VaccineTypeEnum.HepaB1]: [],
			[VaccineTypeEnum.Polio]: [],
			[VaccineTypeEnum.PCV]: [],
			[VaccineTypeEnum.MMR]: [],
			[VaccineTypeEnum.Covid19]: []
		};

		// For each patient, check which vaccines they haven't received
		for (const patient of allPatients) {
			// Get all vaccine reports for this patient
			const patientVaccineReports = allVaccineReports.filter(
				(report) => report.patient_id === patient._id
			);

			// Get the types of vaccines this patient has received
			const receivedVaccineTypes = new Set(patientVaccineReports.map((report) => report.type));

			// Add patient to unvaccinated list for each vaccine type they haven't received
			Object.values(VaccineTypeEnum).forEach((vaccineType) => {
				if (!receivedVaccineTypes.has(vaccineType)) {
					unvaccinatedPatients[vaccineType].push(patient);
				}
			});
		}

		// Create the response object with stats
		const response = {
			...unvaccinatedPatients,
			stats: {
				total_bcg_unvaccinated: unvaccinatedPatients[VaccineTypeEnum.BCG].length,
				total_hepa_b1_unvaccinated: unvaccinatedPatients[VaccineTypeEnum.HepaB1].length,
				total_polio_unvaccinated: unvaccinatedPatients[VaccineTypeEnum.Polio].length,
				total_pcv_unvaccinated: unvaccinatedPatients[VaccineTypeEnum.PCV].length,
				total_mmr_unvaccinated: unvaccinatedPatients[VaccineTypeEnum.MMR].length,
				total_covid19_unvaccinated: unvaccinatedPatients[VaccineTypeEnum.Covid19].length
			}
		};

		return json(response);
	} catch (error) {
		console.error('Error getting unvaccinated patients:', error);
		return json({ error: 'Failed to get unvaccinated patients' }, { status: 500 });
	}
};
