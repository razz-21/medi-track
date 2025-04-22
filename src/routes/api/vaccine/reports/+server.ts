import type { RequestHandler } from './$types';
import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection';
import type { VaccineReport, VaccineReportPost } from '$lib/models/vaccine/vaccine.schema';
import { z } from 'zod';
import { VaccineReportPostSchema } from '$lib/models/vaccine/vaccine.schema';
import { json } from '@sveltejs/kit';
import type { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('page'));
	const limit = Number(url.searchParams.get('limit'));
	const type = url.searchParams.get('type') as VaccineTypeEnum;
	const q = url.searchParams.get('q') ?? '';

	try {
		const [vaccineReports, total] = await Promise.all([
			vaccineReportsCollection
				.aggregate([
					...(type ? [{ $match: { type } }] : []),
					{
						$lookup: {
							from: 'patients',
							localField: 'patient_id',
							foreignField: '_id',
							as: 'patient'
						}
					},
					{
						$lookup: {
							from: 'users',
							localField: 'created_by',
							foreignField: '_id',
							as: 'create_by_user'
						}
					},
					{
						$unwind: '$patient'
					},
					{
						$unwind: {
							path: '$create_by_user',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$addFields: {
							'patient.fullname': {
								$concat: ['$patient.firstname', ' ', '$patient.lastname']
							}
						}
					},
					{
						$match: {
							'patient.fullname': { $regex: q, $options: 'i' }
						}
					},
					{
						$sort: { created_at: -1 }
					},
					{
						$skip: (page - 1) * limit
					},
					{
						$limit: limit
					}
				])
				.toArray(),

			vaccineReportsCollection
				.aggregate([
					{
						$lookup: {
							from: 'patients',
							localField: 'patient_id',
							foreignField: '_id',
							as: 'patient'
						}
					},
					{
						$lookup: {
							from: 'users',
							localField: 'created_by',
							foreignField: '_id',
							as: 'create_by_user'
						}
					},
					{
						$unwind: '$patient'
					},
					{
						$unwind: {
							path: '$create_by_user',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$addFields: {
							'patient.fullname': {
								$concat: ['$patient.firstname', ' ', '$patient.lastname']
							}
						}
					},
					{
						$match: {
							'patient.fullname': { $regex: q, $options: 'i' }
						}
					},
					{
						$count: 'total'
					}
				])
				.toArray()
		]);

		return json({
			success: true,
			total: total[0]?.total ?? 0,
			count: vaccineReports.length,
			reports: vaccineReports
		});
	} catch (error) {
		console.error(error);
		return json(
			{
				success: false,
				message: 'Failed to fetch vaccine reports table'
			},
			{ status: 500 }
		);
	}
};

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
