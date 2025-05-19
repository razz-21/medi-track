import type { DiseaseReport } from '../disease/disease.schema';
import type { VaccineReport } from '../vaccine/vaccine.schema';
import {
	PatientPostSchema,
	PatientRelevantInformationSchema,
	PatientPatchSchema,
	PatientSchema,
	PatientGetTableSchema,
	PatientGetSchema,
	PatientGetTableParamsSchema
} from './patients.schema';
import { z } from 'zod';

export type Patient = z.infer<typeof PatientSchema>;
export type PatientRelevantInformation = z.infer<typeof PatientRelevantInformationSchema>;

export type PatientGet = z.infer<typeof PatientGetSchema>;
export type PatientGetWithHistory = PatientGet & {
	disease_history: DiseaseReport[];
	vaccine_history: VaccineReport[];
};
export type PatientPost = z.infer<typeof PatientPostSchema>;
export type PatientPatch = z.infer<typeof PatientPatchSchema>;
export type PatientGetTable = z.infer<typeof PatientGetTableSchema>;
export type PatientGetTableParams = z.infer<typeof PatientGetTableParamsSchema>;

export enum PatientStatusEnum {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	DELETED = 'deleted'
}

export enum PatientHouseholdRelationshipEnum {
	FATHER = 'Father',
	MOTHER = 'Mother',
	SON = 'Son',
	DAUGHTER = 'Daughter',
	UNCLE = 'Uncle',
	COUSIN = 'Cousin',
	SIBLING = 'Sibling',
	SPOUSE = 'Spouse',
	GRAND_FATHER = 'Grand Father',
	GRAND_MOTHER = 'Grand Mother',
	OTHER = 'Other'
}

export type PatientStatus = (typeof PatientStatusEnum)[keyof typeof PatientStatusEnum];
export type PatientHouseholdRelationship =
	(typeof PatientHouseholdRelationshipEnum)[keyof typeof PatientHouseholdRelationshipEnum];
