import type { RequestHandler } from './$types';
import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection';
import type { VaccineReport, VaccineReportPost } from '$lib/models/vaccine/vaccine.schema';
import { z, ZodError } from 'zod';
import { VaccineReportPostSchema } from '$lib/models/vaccine/vaccine.schema';
import { json } from '@sveltejs/kit';
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as VaccineReportPost;
		const vaccineReport = {
			...body,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		} as VaccineReport;

		VaccineReportPostSchema.parse(vaccineReport);

		const result = await vaccineReportsCollection.insertOne(vaccineReport);

		if (!result.acknowledged) {
			return json(
				{
					success: false,
					message: 'Failed to create vaccine report'
				},
				{ status: 500 }
			);
		}

		return json(
			{
				success: true,
				message: 'Vaccine report created successfully',
				data: vaccineReport
			},
			{ status: 201 }
		);
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
				message: 'Failed to create vaccine report'
			},
			{ status: 500 }
		);
	}
};
