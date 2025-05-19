import { z } from 'zod';
import { UUIDSchema } from '../common/common.schema';
import { VaccineTypeEnum, Covid19VaccineTypeEnum } from './vaccine.type';
import { PatientSchema } from '../patients/patients.schema';
import { UserSchema } from '../user/user.schema';

// Ensure enums are properly defined
if (!VaccineTypeEnum || !Covid19VaccineTypeEnum) {
	throw new Error('Vaccine enums are not properly defined');
}

export const VaccineBaseDetailsSchema = z.object({
	_id: UUIDSchema,
	dose: z.string(),
	immunization_date: z.string(),
	weight: z.number(),
	height: z.number(),
	remarks: z.string().nullable()
});

export const VaccineBaseDetailsArraySchema = z.array(VaccineBaseDetailsSchema);

export const Covid19VaccineDetailsSchema = z.object({
	_id: UUIDSchema,
	dose: z.string(),
	brand: z.nativeEnum(Covid19VaccineTypeEnum, {
		required_error: 'Vaccine brand is required',
		invalid_type_error: 'Invalid vaccine brand'
	}),
	lot_number: z.string(),
	vaccinator: z.string(),
	date: z.string()
});

export const Covid19VaccineDetailsArraySchema = z.array(Covid19VaccineDetailsSchema);

export const VaccineReportSchema = z.object({
	_id: UUIDSchema,
	patient_id: UUIDSchema,
	type: z.nativeEnum(VaccineTypeEnum, {
		required_error: 'Vaccine type is required',
		invalid_type_error: 'Invalid vaccine type'
	}),
	description: z.string(),
	details: z.union([VaccineBaseDetailsArraySchema, Covid19VaccineDetailsArraySchema]).nullable(),
	created_by: UUIDSchema,
	created_at: z.string(),
	updated_at: z.string()
});

export const VaccineReportGetTableParamsSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	q: z.string().optional(),
	type: z.nativeEnum(VaccineTypeEnum).optional()
});

export const VaccineReportGetTableSchema = z
	.object({
		total: z.number(),
		count: z.number(),
		reports: z.array(
			VaccineReportSchema.omit({ details: true }).extend({
				patient: PatientSchema,
				create_by_user: UserSchema
			})
		)
	})
	.extend(VaccineReportGetTableParamsSchema.shape);

export const VaccineReportGetSchema = VaccineReportSchema.extend({
	patient: PatientSchema
});

export const VaccineReportPostSchema = VaccineReportSchema.omit({
	_id: true,
	created_at: true,
	updated_at: true
});

export const VaccineReportPatchSchema = VaccineReportSchema.omit({
	_id: true,
	created_at: true,
	updated_at: true
}).partial();

export const VaccineSiteSchema = z.object({
	cases_stats: z
		.object({
			type: z.nativeEnum(VaccineTypeEnum),
			count: z.number()
		})
		.partial()
		.array(),
	[VaccineTypeEnum.BCG]: z.object({
		total_cases: z.number(),
		total_cases_year: z.number(),
		total_cases_month: z.number(),
		total_cases_week: z.number()
	}),
	[VaccineTypeEnum.HepaB1]: z.object({
		total_cases: z.number(),
		total_cases_year: z.number(),
		total_cases_month: z.number(),
		total_cases_week: z.number()
	}),
	[VaccineTypeEnum.Polio]: z.object({
		total_cases: z.number(),
		total_cases_year: z.number(),
		total_cases_month: z.number(),
		total_cases_week: z.number()
	}),
	[VaccineTypeEnum.PCV]: z.object({
		total_cases: z.number(),
		total_cases_year: z.number(),
		total_cases_month: z.number(),
		total_cases_week: z.number()
	}),
	[VaccineTypeEnum.MMR]: z.object({
		total_cases: z.number(),
		total_cases_year: z.number(),
		total_cases_month: z.number(),
		total_cases_week: z.number()
	}),
	[VaccineTypeEnum.Covid19]: z.object({
		total_cases: z.number(),
		total_cases_year: z.number(),
		total_cases_month: z.number(),
		total_cases_week: z.number()
	})
});

export const VaccineAnalysisSchema = z.object({
	[VaccineTypeEnum.BCG]: PatientSchema.omit({ relevant_information: true }).array(),
	[VaccineTypeEnum.HepaB1]: PatientSchema.omit({ relevant_information: true }).array(),
	[VaccineTypeEnum.Polio]: PatientSchema.omit({ relevant_information: true }).array(),
	[VaccineTypeEnum.PCV]: PatientSchema.omit({ relevant_information: true }).array(),
	[VaccineTypeEnum.MMR]: PatientSchema.omit({ relevant_information: true }).array(),
	[VaccineTypeEnum.Covid19]: PatientSchema.omit({ relevant_information: true }).array(),
	stats: z.object({
		total_bcg_unvaccinated: z.number(),
		total_hepa_b1_unvaccinated: z.number(),
		total_polio_unvaccinated: z.number(),
		total_pcv_unvaccinated: z.number(),
		total_mmr_unvaccinated: z.number(),
		total_covid19_unvaccinated: z.number()
	})
});

export type VaccineReport = z.infer<typeof VaccineReportSchema>;
export type VaccineBaseDetails = z.infer<typeof VaccineBaseDetailsSchema>;
export type VaccineBaseDetailsArray = z.infer<typeof VaccineBaseDetailsArraySchema>;
export type Covid19VaccineDetails = z.infer<typeof Covid19VaccineDetailsSchema>;
export type Covid19VaccineDetailsArray = z.infer<typeof Covid19VaccineDetailsArraySchema>;
export type VaccineReportGetTable = z.infer<typeof VaccineReportGetTableSchema>;
export type VaccineReportsTableParams = z.infer<typeof VaccineReportGetTableParamsSchema>;
export type VaccineReportPost = z.infer<typeof VaccineReportPostSchema>;
export type VaccineReportGet = z.infer<typeof VaccineReportGetSchema>;
export type VaccineReportPatch = z.infer<typeof VaccineReportPatchSchema>;
export type VaccineSite = z.infer<typeof VaccineSiteSchema>;
export type VaccineAnalysis = z.infer<typeof VaccineAnalysisSchema>;
