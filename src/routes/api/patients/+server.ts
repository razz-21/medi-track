import type { RequestHandler } from './$types';
import patientsCollection from '$lib/server/mongo/collections/patients.collection';
import { PatientStatusEnum } from '$lib/models/patients/patient.type';
import { PatientPostSchema } from '$lib/models/patients/patients.schema';
import { z } from 'zod';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { patient } = await request.json();
		PatientPostSchema.parse(patient);

		const patientData = {
			...patient,
			status: PatientStatusEnum.ACTIVE,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		const result = await patientsCollection.insertOne(patientData);

		if (!result.acknowledged) {
			return new Response(JSON.stringify({ message: 'Failed to create patient' }), {
				status: 500
			});
		}

		return new Response(JSON.stringify({ patient: patientData }), {
			status: 201
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.errors.map((err) => ({
				field: err.path.join('.'),
				message: err.message
			}));

			return json(
				{
					success: false,
					errors
				},
				{ status: 400 }
			);
		}

		return json(
			{
				success: false,
				message: 'Failed to create patient'
			},
			{ status: 500 }
		);
	}
};
