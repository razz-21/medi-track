import { DiseaseTypeEnum } from '$lib/models/disease/disease.type';
import type { PageServerLoad } from './$types';
import { diseaseReportsCollection } from '$lib/server/mongo/collections/diseases.collection';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const currentDate = new Date();

	try {
		const stats = {
			cases_stats: [] as { type: DiseaseTypeEnum; count: number }[],
			[DiseaseTypeEnum.Covid19]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[DiseaseTypeEnum.Dengue]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[DiseaseTypeEnum.Influenza]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[DiseaseTypeEnum.TB]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			},
			[DiseaseTypeEnum.HIV]: {
				total_cases: 0,
				total_cases_year: 0,
				total_cases_month: 0,
				total_cases_week: 0
			}
		};

		// Get total cases for each disease type
		for (const diseaseType of Object.values(DiseaseTypeEnum)) {
			const totalCases = await diseaseReportsCollection.countDocuments({
				disease_type: diseaseType
			});
			const yearCases = await diseaseReportsCollection.countDocuments({
				disease_type: diseaseType,
				date_reported: {
					$gte: new Date(currentYear, 0, 1).toISOString(),
					$lt: new Date(currentYear + 1, 0, 1).toISOString()
				}
			});
			const monthCases = await diseaseReportsCollection.countDocuments({
				disease_type: diseaseType,
				date_reported: {
					$gte: new Date(currentYear, currentMonth, 1).toISOString(),
					$lt: new Date(currentYear, currentMonth + 1, 1).toISOString()
				}
			});
			const weekCases = await diseaseReportsCollection.countDocuments({
				disease_type: diseaseType,
				date_reported: {
					$gte: new Date(
						currentDate.getTime() - currentDate.getDay() * 24 * 60 * 60 * 1000
					).toISOString(),
					$lt: new Date(
						currentDate.getTime() + (7 - currentDate.getDay()) * 24 * 60 * 60 * 1000
					).toISOString()
				}
			});

			stats[diseaseType] = {
				total_cases: totalCases,
				total_cases_year: yearCases,
				total_cases_month: monthCases,
				total_cases_week: weekCases
			};

			stats.cases_stats.push({
				type: diseaseType,
				count: totalCases
			});
		}

		return {
			stats
		};
	} catch (e) {
		return error(500, {
			message: 'Failed to get disease site stats'
		});
	}
};
