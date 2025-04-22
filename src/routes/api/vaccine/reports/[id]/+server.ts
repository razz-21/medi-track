import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const vaccineReport = await vaccineReportsCollection
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
				$unwind: '$patient'
			}
		])
		.toArray();

	const report = vaccineReport[0];

	if (!report) {
		return json({ error: 'Vaccine report not found' }, { status: 404 });
	}

	return json(report);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	const payload = {
		...(await request.json()),
		updated_at: new Date().toISOString()
	};

	const result = await vaccineReportsCollection.updateOne({ _id: id }, { $set: payload });

	if (!result.modifiedCount) {
		return json({ error: 'Vaccine report not found' }, { status: 404 });
	}

	const updatedVaccineReport = await vaccineReportsCollection.findOne({ _id: id });

	return json(updatedVaccineReport, { status: 200 });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;

	const result = await vaccineReportsCollection.deleteOne({ _id: id });

	if (!result.deletedCount) {
		return json({ error: 'Vaccine report not found' }, { status: 404 });
	}

	return json({ message: 'Vaccine report deleted successfully' }, { status: 200 });
};
