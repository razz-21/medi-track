import { z } from 'zod';
import { UUIDSchema } from '../common/common.schema';
import { VaccineTypeEnum, Covid19VaccineTypeEnum } from './vaccine.type';
import { PatientSchema } from '../patients/patients.schema';

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
	page: z.number(),
	limit: z.number(),
	q: z.string().optional()
});

export const VaccineReportGetTableSchema = z
	.object({
		total: z.number(),
		count: z.number(),
		reports: z.array(VaccineReportSchema.omit({ details: true }))
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

export type VaccineReport = z.infer<typeof VaccineReportSchema>;
export type VaccineBaseDetails = z.infer<typeof VaccineBaseDetailsSchema>;
export type VaccineBaseDetailsArray = z.infer<typeof VaccineBaseDetailsArraySchema>;
export type Covid19VaccineDetails = z.infer<typeof Covid19VaccineDetailsSchema>;
export type Covid19VaccineDetailsArray = z.infer<typeof Covid19VaccineDetailsArraySchema>;
export type VaccineReportGetTable = z.infer<typeof VaccineReportGetTableSchema>;
export type VaccineReportPost = z.infer<typeof VaccineReportPostSchema>;
export type VaccineReportGet = z.infer<typeof VaccineReportGetSchema>;
export type VaccineReportPatch = z.infer<typeof VaccineReportPatchSchema>;
