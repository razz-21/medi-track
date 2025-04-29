import { z } from 'zod';
import { VaccineTypeEnum } from '../vaccine/vaccine.type';
import { DiseaseTypeEnum } from '../disease/disease.type';
import { BaranggayEnum } from '../common/common.types';
export const DashboardSchema = z.object({
	totalPatients: z.number(),
	totalDiseaseReports: z.number(),
	totalVaccineReports: z.number(),
	totalReports: z.number(),
	totalUsers: z.number(),
	vaccine_datasets: z.array(
		z.object({
			type: z.nativeEnum(VaccineTypeEnum),
			value: z.array(
				z.object({
					month: z.string(),
					value: z.number()
				})
			)
		})
	),
	disease_datasets: z.array(
		z.object({
			type: z.nativeEnum(DiseaseTypeEnum),
			value: z.array(
				z.object({
					month: z.string(),
					value: z.number()
				})
			)
		})
	)
});

export const DashboardParamsSchema = z.object({
	year: z.string().optional()
});

export const DashboardGetSchema = DashboardSchema;

export const DashboardStatsSchema = z.object({
	disease_stats: z.array(
		z.object({
			type: z.nativeEnum(DiseaseTypeEnum),
			value: z.number()
		})
	),
	vaccine_stats: z.array(
		z.object({
			type: z.nativeEnum(VaccineTypeEnum),
			value: z.number()
		})
	),
	vaccine_disease_stats: z.object({
		vaccinated: z.number(),
		diseased: z.number()
	}),
	vaccined_brgy_stats: z.array(
		z.object({
			brgy: z.nativeEnum(BaranggayEnum),
			value: z.number()
		})
	),
	diseased_brgy_stats: z.array(
		z.object({
			brgy: z.nativeEnum(BaranggayEnum),
			value: z.number()
		})
	)
});

export const DashboardStatsGetSchema = DashboardStatsSchema;

export const DashboardStatsGetParamsSchema = z.object({
	from: z.string(),
	to: z.string()
});

export type Dashboard = z.infer<typeof DashboardSchema>;
export type DashboardParams = z.infer<typeof DashboardParamsSchema>;
export type DashboardGet = z.infer<typeof DashboardGetSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type DashboardStatsGet = z.infer<typeof DashboardStatsGetSchema>;
export type DashboardStatsGetParams = z.infer<typeof DashboardStatsGetParamsSchema>;
