import { z } from 'zod';
import { UUIDSchema } from '../common/common.schema';
import { DiseaseTypeEnum, DiseaseModeTransmissionEnum, DiseaseICDCodeEnum } from './disease.type';
import { UserSchema } from '../user/user.schema';
import { PatientSchema } from '../patients/patients.schema';

export const DiseaseReportSchema = z.object({
	_id: UUIDSchema,
	patient_id: UUIDSchema,
	disease_type: z.nativeEnum(DiseaseTypeEnum),
	icd_code: z.nativeEnum(DiseaseICDCodeEnum),
	mode_of_transmission: z.nativeEnum(DiseaseModeTransmissionEnum),
	date_diagnosed: z.string(),
	date_reported: z.string(),
	remarks: z.string().nullable(),
	created_by: UUIDSchema,
	created_at: z.string().datetime(),
	updated_at: z.string().datetime()
});

export const DiseaseReportTableParamsSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	type: z.nativeEnum(DiseaseTypeEnum).optional(),
	q: z.string().optional()
});

export const DiseaseReportTableSchema = z
	.object({
		total: z.number(),
		count: z.number(),
		reports: DiseaseReportSchema.extend({
			patient: PatientSchema,
			created_user_by: UserSchema
		}).array()
	})
	.extend(DiseaseReportTableParamsSchema.shape);

export const DiseaseReportGetSchema = DiseaseReportSchema.omit({
	_id: true
}).extend({ patient: PatientSchema, created_user_by: UserSchema });

export const DiseaseReportPostSchema = DiseaseReportSchema.omit({
	created_at: true,
	updated_at: true
});

export const DiseaseReportPatchSchema = DiseaseReportSchema.omit({
	_id: true,
	created_by: true,
	created_at: true,
	updated_at: true
}).partial();

export type DiseaseReport = z.infer<typeof DiseaseReportSchema>;
export type DiseaseReportGet = z.infer<typeof DiseaseReportGetSchema>;
export type DiseaseReportPost = z.infer<typeof DiseaseReportPostSchema>;
export type DiseaseReportPatch = z.infer<typeof DiseaseReportPatchSchema>;
export type DiseaseReportTable = z.infer<typeof DiseaseReportTableSchema>;
export type DiseaseReportTableParams = z.infer<typeof DiseaseReportTableParamsSchema>;
