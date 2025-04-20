import type { UUIDSchema } from './common.schema';
import type { z } from 'zod';

export type UUID = z.infer<typeof UUIDSchema>;

export enum GenderEnum {
	MALE = 'male',
	FEMALE = 'female'
}

export type Gender = (typeof GenderEnum)[keyof typeof GenderEnum];
