import { UserPostSchema } from '$lib/models/user/user.schema';
import { UserStatusEnum } from '$lib/models/user/user.type';
import type { User } from '$lib/models/user/user.type';
import userCollection from '$lib/server/mongo/collections/user.collection';
import { hashPassword } from '$lib/utils/password.util';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const users = await userCollection.find({}).toArray();
	return new Response(JSON.stringify(users));
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const validatedBody = UserPostSchema.parse(body);
	const hashedPassword = await hashPassword(validatedBody.password);

	const user = {
		...validatedBody,
		password: hashedPassword,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: UserStatusEnum.Active
	} as User;

	const existingUser = await userCollection.findOne({ username: user.username });
	if (existingUser) {
		error(400, { message: 'Username already exists' });
	}

	await userCollection.insertOne(user);
	return new Response(JSON.stringify(user), { status: 201 });
};
