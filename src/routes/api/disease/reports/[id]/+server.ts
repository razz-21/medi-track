import { diseaseReportsCollection } from '$lib/server/mongo/collections/diseases.collection';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const diseaseReport = await diseaseReportsCollection
		.aggregate([
			{
				$match: {
					_id: id
				}
			},
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
					as: 'created_user_by'
				}
			},
			{
				$unwind: {
					path: '$patient',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$unwind: {
					path: '$created_user_by',
					preserveNullAndEmptyArrays: true
				}
			}
		])
		.toArray();

	if (!diseaseReport || diseaseReport.length === 0) {
		return json({ error: 'Disease report not found' }, { status: 404 });
	}

	return json(diseaseReport[0], { status: 200 });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	const payload = await request.json();

	const result = await diseaseReportsCollection.updateOne({ _id: id }, { $set: payload });

	if (result.modifiedCount === 0) {
		return json({ error: 'Disease report not found' }, { status: 404 });
	}

	const updatedDiseaseReport = await diseaseReportsCollection
		.aggregate([
			{
				$match: {
					_id: id
				}
			},
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
					as: 'created_user_by'
				}
			},
			{
				$unwind: {
					path: '$patient',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$unwind: {
					path: '$created_user_by',
					preserveNullAndEmptyArrays: true
				}
			}
		])
		.toArray();

	return json(updatedDiseaseReport[0], { status: 200 });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;

	const result = await diseaseReportsCollection.deleteOne({ _id: id });

	if (result.deletedCount === 0) {
		return json({ error: 'Disease report not found' }, { status: 404 });
	}

	return json({ message: 'Disease report deleted successfully' }, { status: 200 });
};
