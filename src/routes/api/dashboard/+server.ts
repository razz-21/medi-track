import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
import { diseaseReportsCollection } from '$lib/server/mongo/collections/diseases.collection';
import patientsCollection from '$lib/server/mongo/collections/patients.collection';
import userCollection from '$lib/server/mongo/collections/user.collection';
import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const year = url.searchParams.get('year') ?? '2025';
	const date = year ? new Date(parseInt(year), 0, 1) : new Date();

	const totalPatients = await patientsCollection.estimatedDocumentCount();
	const totalVaccineReports = await vaccineReportsCollection.estimatedDocumentCount();
	const totalDiseaseReports = await diseaseReportsCollection.estimatedDocumentCount();
	const totalReports = totalVaccineReports + totalDiseaseReports;
	const totalUsers = await userCollection.estimatedDocumentCount();

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const vaccine_datasets = await vaccineReportsCollection
		.aggregate([
			{
				$match: {
					$or: [
						{
							type: VaccineTypeEnum.Covid19,
							'details.date': {
								$gte: new Date(date.getFullYear(), 0, 1).toISOString(),
								$lt: new Date(date.getFullYear() + 1, 0, 1).toISOString()
							}
						},
						{
							type: { $ne: VaccineTypeEnum.Covid19 },
							'details.immunization_date': {
								$gte: new Date(date.getFullYear(), 0, 1).toISOString(),
								$lt: new Date(date.getFullYear() + 1, 0, 1).toISOString()
							}
						}
					]
				}
			},
			{
				$project: {
					type: 1,
					date: {
						$cond: {
							if: { $eq: ['$type', VaccineTypeEnum.Covid19] },
							then: { $arrayElemAt: ['$details.date', 0] },
							else: { $arrayElemAt: ['$details.immunization_date', 0] }
						}
					}
				}
			},
			{
				$group: {
					_id: {
						type: '$type',
						monthNum: { $toInt: { $substr: ['$date', 5, 2] } },
						month: {
							$let: {
								vars: {
									monthIndex: { $subtract: [{ $toInt: { $substr: ['$date', 5, 2] } }, 1] }
								},
								in: {
									$arrayElemAt: [monthNames, '$$monthIndex']
								}
							}
						}
					},
					value: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: '$_id.type',
					value: {
						$push: {
							month: '$_id.month',
							monthNum: '$_id.monthNum',
							value: '$value'
						}
					}
				}
			},
			{
				$project: {
					_id: 0,
					type: '$_id',
					value: {
						$concatArrays: [
							'$value',
							{
								$map: {
									input: { $range: [0, 12] },
									as: 'monthNum',
									in: {
										month: { $arrayElemAt: [monthNames, '$$monthNum'] },
										monthNum: { $add: ['$$monthNum', 1] },
										value: 0
									}
								}
							}
						]
					}
				}
			},
			{
				$project: {
					type: 1,
					value: {
						$reduce: {
							input: '$value',
							initialValue: [],
							in: {
								$concatArrays: [
									'$$value',
									{
										$cond: {
											if: { $in: ['$$this.month', '$$value.month'] },
											then: [],
											else: ['$$this']
										}
									}
								]
							}
						}
					}
				}
			},
			{
				$project: {
					type: 1,
					value: {
						$sortArray: {
							input: '$value',
							sortBy: { monthNum: 1 }
						}
					}
				}
			},
			{
				$project: {
					type: 1,
					value: {
						$map: {
							input: '$value',
							as: 'item',
							in: {
								month: '$$item.month',
								value: '$$item.value'
							}
						}
					}
				}
			}
		])
		.toArray();

	const disease_datasets = await diseaseReportsCollection
		.aggregate([
			{
				$match: {
					date_reported: {
						$gte: new Date(date.getFullYear(), 0, 1).toISOString(),
						$lt: new Date(date.getFullYear() + 1, 0, 1).toISOString()
					}
				}
			},
			{
				$group: {
					_id: {
						disease_type: '$disease_type',
						monthNum: { $toInt: { $substr: ['$date_reported', 5, 2] } },
						month: {
							$let: {
								vars: {
									monthIndex: { $subtract: [{ $toInt: { $substr: ['$date_reported', 5, 2] } }, 1] }
								},
								in: {
									$arrayElemAt: [monthNames, '$$monthIndex']
								}
							}
						}
					},
					value: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: '$_id.disease_type',
					value: {
						$push: {
							month: '$_id.month',
							monthNum: '$_id.monthNum',
							value: '$value'
						}
					}
				}
			},
			{
				$project: {
					_id: 0,
					type: '$_id',
					value: {
						$concatArrays: [
							'$value',
							{
								$map: {
									input: { $range: [0, 12] },
									as: 'monthNum',
									in: {
										month: { $arrayElemAt: [monthNames, '$$monthNum'] },
										monthNum: { $add: ['$$monthNum', 1] },
										value: 0
									}
								}
							}
						]
					}
				}
			},
			{
				$project: {
					type: 1,
					value: {
						$reduce: {
							input: '$value',
							initialValue: [],
							in: {
								$concatArrays: [
									'$$value',
									{
										$cond: {
											if: { $in: ['$$this.month', '$$value.month'] },
											then: [],
											else: ['$$this']
										}
									}
								]
							}
						}
					}
				}
			},
			{
				$project: {
					type: 1,
					value: {
						$sortArray: {
							input: '$value',
							sortBy: { monthNum: 1 }
						}
					}
				}
			},
			{
				$project: {
					type: 1,
					value: {
						$map: {
							input: '$value',
							as: 'item',
							in: {
								month: '$$item.month',
								value: '$$item.value'
							}
						}
					}
				}
			}
		])
		.toArray();

	return json(
		{
			totalPatients,
			totalVaccineReports,
			totalDiseaseReports,
			totalReports,
			totalUsers,
			vaccine_datasets,
			disease_datasets
		},
		{ status: 200 }
	);
};
