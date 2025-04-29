import { DiseaseTypeEnum } from '$lib/models/disease/disease.type';
import type { PageServerLoad } from './$types';
import { diseaseReportsCollection } from '$lib/server/mongo/collections/diseases.collection';
import { error } from '@sveltejs/kit';
import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
import { vaccineReportsCollection } from '$lib/server/mongo/collections/vaccines.collection';

export const load: PageServerLoad = async () => {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const currentDate = new Date();

	try {
		const stats = {
			cases_stats: [] as { type: VaccineTypeEnum; count: number }[],
			[VaccineTypeEnum.BCG]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[VaccineTypeEnum.HepaB1]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[VaccineTypeEnum.Polio]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[VaccineTypeEnum.PCV]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[VaccineTypeEnum.MMR]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[VaccineTypeEnum.Covid19]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			}
		};

		for (const vaccineType of Object.values(VaccineTypeEnum)) {
			const totalCases = await vaccineReportsCollection.countDocuments({ type: vaccineType });

			// For COVID-19, use details[0].date
			// For others, use details[0].immunization_date
			const dateField =
				vaccineType === VaccineTypeEnum.Covid19 ? 'details.0.date' : 'details.0.immunization_date';

			const yearCases = await vaccineReportsCollection.countDocuments({
				type: vaccineType,
				[dateField]: {
					$gte: new Date(currentYear, 0, 1).toISOString(),
					$lt: new Date(currentYear + 1, 0, 1).toISOString()
				}
			});
			const monthCases = await vaccineReportsCollection.countDocuments({
				type: vaccineType,
				[dateField]: {
					$gte: new Date(currentYear, currentMonth, 1).toISOString(),
					$lt: new Date(currentYear, currentMonth + 1, 1).toISOString()
				}
			});
			const weekCases = await vaccineReportsCollection.countDocuments({
				type: vaccineType,
				[dateField]: {
					$gte: new Date(
						currentDate.getTime() - currentDate.getDay() * 24 * 60 * 60 * 1000
					).toISOString(),
					$lt: new Date(
						currentDate.getTime() + (7 - currentDate.getDay()) * 24 * 60 * 60 * 1000
					).toISOString()
				}
			});

			stats[vaccineType] = {
				total_cases: totalCases,
				total_cases_year: yearCases,
				total_cases_month: monthCases,
				total_cases_week: weekCases
			};

			stats.cases_stats.push({
				type: vaccineType,
				count: totalCases
			});
		}

		return {
			stats
		};
	} catch (e) {
		return error(500, { message: 'Failed to get vaccine site stats' });
	}
};
