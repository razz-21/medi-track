import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
import { diseaseReportsCollection } from '$lib/server/mongo/collections/diseases.collection';
import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection';
import { json } from '@sveltejs/kit';
import { format, startOfYear } from 'date-fns';

export const GET = async ({ url }) => {
	const from = url.searchParams.get('from') ?? format(startOfYear(new Date()), 'yyyy-MM-dd');
	const to = url.searchParams.get('to') ?? format(new Date(), 'yyyy-MM-dd');

	const fromDate = new Date(from).toISOString();
	const toDate = new Date(to).toISOString();

	try {
		const vaccine_stats = await vaccineReportsCollection
			.aggregate([
				{
					$match: {
						$or: [
							{
								type: VaccineTypeEnum.Covid19,
								'details.date': {
									$gte: fromDate,
									$lte: toDate
								}
							},
							{
								type: { $ne: VaccineTypeEnum.Covid19 },
								'details.immunization_date': {
									$gte: fromDate,
									$lte: toDate
								}
							}
						]
					}
				},
				{
					$group: {
						_id: null,
						total: { $sum: 1 },
						types: {
							$push: {
								type: '$type',
								count: 1
							}
						}
					}
				},
				{
					$unwind: '$types'
				},
				{
					$group: {
						_id: '$types.type',
						count: { $sum: '$types.count' },
						total: { $first: '$total' }
					}
				},
				{
					$project: {
						_id: 0,
						type: '$_id',
						value: {
							$round: [
								{
									$multiply: [{ $divide: ['$count', '$total'] }, 100]
								},
								2
							]
						}
					}
				}
			])
			.toArray();

		const disease_stats = await diseaseReportsCollection
			.aggregate([
				{
					$match: {
						date_reported: {
							$gte: fromDate,
							$lte: toDate
						}
					}
				},
				{
					$group: {
						_id: null,
						total: { $sum: 1 },
						types: {
							$push: {
								type: '$disease_type',
								count: 1
							}
						}
					}
				},
				{
					$unwind: '$types'
				},
				{
					$group: {
						_id: '$types.type',
						count: { $sum: '$types.count' },
						total: { $first: '$total' }
					}
				},
				{
					$project: {
						_id: 0,
						type: '$_id',
						value: {
							$round: [
								{
									$multiply: [{ $divide: ['$count', '$total'] }, 100]
								},
								2
							]
						}
					}
				}
			])
			.toArray();

		const vaccine_reports_count = await vaccineReportsCollection.countDocuments({
			$or: [
				{
					type: VaccineTypeEnum.Covid19,
					'details.date': {
						$gte: fromDate,
						$lte: toDate
					}
				},
				{
					type: { $ne: VaccineTypeEnum.Covid19 },
					'details.immunization_date': {
						$gte: fromDate,
						$lte: toDate
					}
				}
			]
		});

		const disease_reports_count = await diseaseReportsCollection.countDocuments({
			$or: [
				{
					date_reported: {
						$gte: fromDate,
						$lte: toDate
					}
				}
			]
		});

		const total_reports = vaccine_reports_count + disease_reports_count;
		const vaccine_disease_stats = {
			vaccinated: Math.round((vaccine_reports_count / total_reports) * 100) || 0,
			diseased: Math.round((disease_reports_count / total_reports) * 100) || 0
		};

		return json(
			{
				vaccine_stats,
				disease_stats,
				vaccine_disease_stats
			},
			{ status: 200 }
		);
	} catch (error) {
		return json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
	}
};
