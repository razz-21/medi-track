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
	status: z.enum(Object.values(UserStatusEnum) as [string, ...string[]]),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional()
});

export const UserPostSchema = UserSchema.omit({ createdAt: true, updatedAt: true, status: true });
