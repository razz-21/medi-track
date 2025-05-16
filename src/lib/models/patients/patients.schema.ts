import { z } from 'zod';
import { UUIDSchema } from '../common/common.schema';
import { PatientStatusEnum, PatientHouseholdRelationshipEnum } from './patient.type';
import { GenderEnum } from '../common/common.types';

export const PatientRelevantInformationSchema = z.object({
	mothers_name: z.string().nullable().default(null),
	mothers_contact_number: z.string().nullable().default(null),
	mothers_occupation: z.string().nullable().default(null),
	fathers_name: z.string().nullable().default(null),
	fathers_contact_number: z.string().nullable().default(null),
	fathers_occupation: z.string().nullable().default(null)
});

export const PatientStatusSchema = z.nativeEnum(PatientStatusEnum);
export const PatientGenderSchema = z.nativeEnum(GenderEnum);
export const PatientHouseholdRelationshipSchema = z.nativeEnum(PatientHouseholdRelationshipEnum);

export const PatientSchema = z.object({
	_id: UUIDSchema,
	firstname: z.string(),
	middlename: z.string().nullable().default(null),
	lastname: z.string(),
	gender: PatientGenderSchema,
	date_of_birth: z.string(),
	contact_number: z.string().nullable().default(null),
	address: z.string(),
	hsn: z.string().nullable().default(null),
	household_relationship: z.string().nullable().default(null),
	weight: z.number().nullable().default(null),
	height: z.number().nullable().default(null),
	blood_type: z.string().nullable().default(null),
	relevant_information: PatientRelevantInformationSchema.nullable().default(null),
	status: PatientStatusSchema,
	created_at: z.string(),
	updated_at: z.string()
});

export const PatientGetTableParamsSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	q: z.string().optional()
});

export const PatientGetTableSchema = z
	.object({
		total: z.number(),
		count: z.number(),
		patients: z.array(PatientSchema.omit({ relevant_information: true }))
	})
	.extend(PatientGetTableParamsSchema.shape);

export const PatientFamilyMemberSchema = PatientSchema.omit({ relevant_information: true });

export const PatientGetSchema = PatientSchema.extend({
	family_members: z.array(PatientFamilyMemberSchema)
});

export const PatientPostSchema = PatientSchema.omit({
	_id: true,
	created_at: true,
	updated_at: true,
	status: true
});

export const PatientPatchSchema = PatientSchema.omit({
	_id: true,
	created_at: true,
	updated_at: true
}).partial();
