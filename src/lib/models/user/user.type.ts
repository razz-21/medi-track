import type {
	UserSchema,
	UserPostSchema,
	UserGetSchema,
	UserPatchSchema,
	UserGetTableSchema,
	UserGetTableUserParamsSchema
} from './user.schema';
import type { z } from 'zod';

export type User = z.infer<typeof UserSchema>;
export type UserGetTable = z.infer<typeof UserGetTableSchema>;
export type UserGetTableUserParams = z.infer<typeof UserGetTableUserParamsSchema>;
export type UserGet = z.infer<typeof UserGetSchema>;
export type UserPost = z.infer<typeof UserPostSchema>;
export type UserPatch = z.infer<typeof UserPatchSchema>;

export const UserTypeEnum = {
	Encoder: 'Encoder',
	Admin: 'Admin'
} as const;

export type UserType = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];

export const UserStatusEnum = {
	Active: 'Active',
	Inactive: 'Inactive',
	Deleted: 'Deleted'
} as const;

export type UserStatus = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
