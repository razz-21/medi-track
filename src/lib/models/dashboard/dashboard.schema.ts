import { z } from 'zod';
import { VaccineTypeEnum } from '../vaccine/vaccine.type';
import { DiseaseTypeEnum } from '../disease/disease.type';
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

export type Dashboard = z.infer<typeof DashboardSchema>;
export type DashboardParams = z.infer<typeof DashboardParamsSchema>;
export type DashboardGetSchema = z.infer<typeof DashboardGetSchema>;
