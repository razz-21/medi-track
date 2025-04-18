import { z } from 'zod';
import { UUIDSchema } from '../common/common.schema';
import { UserStatusEnum, UserTypeEnum } from './user.type';

export const UserSchema = z.object({
	_id: UUIDSchema,
	firstname: z.string(),
	lastname: z.string(),
	username: z.string(),
	role: z.nativeEnum(UserTypeEnum),
	password: z.string(),
	status: z.nativeEnum(UserStatusEnum),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional()
});

export const UserGetSchema = UserSchema.omit({ password: true });

export const UserPostSchema = UserSchema.omit({ createdAt: true, updatedAt: true, status: true });

export const UserPatchSchema = UserSchema.omit({ _id: true, createdAt: true })
	.extend({
		currentPassword: z.string()
	})
	.partial();
