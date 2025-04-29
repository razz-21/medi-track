import { json } from '@sveltejs/kit';
import { diseaseReportsCollection } from '$lib/server/mongo/collections/diseases.collection';
import type { DiseaseReportPost, DiseaseReport } from '$lib/models/disease/disease.schema.js';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { DiseaseTypeEnum } from '$lib/models/disease/disease.type';

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('page'));
	const limit = Number(url.searchParams.get('limit'));
	const type = url.searchParams.get('type') as DiseaseTypeEnum;
	const q = url.searchParams.get('q') ?? '';

	try {
		const [diseaseReports, total] = await Promise.all([
			diseaseReportsCollection
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

			diseaseReportsCollection
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
			count: diseaseReports.length,
			reports: diseaseReports
		});
	} catch (error) {
		console.error(error);
		return json(
			{
				success: false,
				message: 'Failed to fetch disease reports table'
			},
			{ status: 500 }
		);
	}
};

export const POST = async ({ request }) => {
	try {
		const body = (await request.json()) as DiseaseReportPost;
		const payload: DiseaseReport = {
			...body,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		const result = await diseaseReportsCollection.insertOne(payload);

		if (!result.acknowledged) {
			return json(
				{
					success: false,
					message: 'Failed to create disease report'
				},
				{ status: 500 }
			);
		}

		const createdReport = await diseaseReportsCollection.findOne({ _id: result.insertedId });

		return json(
			{
				success: true,
				message: 'Disease report created successfully',
				data: createdReport
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.errors.map((err) => ({
				path: err.path.join('.'),
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
				message: 'Internal server error'
			},
			{ status: 500 }
		);
	}
};
