import type { UserSchema, UserPostSchema } from './user.schema';
import type { z } from 'zod';

export type User = z.infer<typeof UserSchema>;
export type UserPost = z.infer<typeof UserPostSchema>;

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
