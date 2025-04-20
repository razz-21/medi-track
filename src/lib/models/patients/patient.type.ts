import {
	PatientPostSchema,
	PatientRelevantInformationSchema,
	PatientPatchSchema,
	PatientSchema,
	PatientGetTableSchema,
	PatientGetSchema
} from './patients.schema';
import { z } from 'zod';

export type Patient = z.infer<typeof PatientSchema>;
export type PatientRelevantInformation = z.infer<typeof PatientRelevantInformationSchema>;
export type PatientGet = z.infer<typeof PatientGetSchema>;
export type PatientPost = z.infer<typeof PatientPostSchema>;
export type PatientPatch = z.infer<typeof PatientPatchSchema>;
export type PatientGetTable = z.infer<typeof PatientGetTableSchema>;

export enum PatientStatusEnum {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	DELETED = 'deleted'
}

export type PatientStatus = (typeof PatientStatusEnum)[keyof typeof PatientStatusEnum];
