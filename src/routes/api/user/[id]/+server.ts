import { UserGetSchema, UserPatchSchema } from '$lib/models/user/user.schema';
import type { UserType } from '$lib/models/user/user.type';
import userCollection from '$lib/server/mongo/collections/user.collection';
import { hashPassword, verifyPassword } from '$lib/utils/password.util';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	const user = await userCollection.findOne({ _id: id });

	if (!user) {
		error(404, { message: 'User not found' });
	}

	const userGet = UserGetSchema.parse(user);

	return new Response(JSON.stringify(userGet), { status: 200 });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	const user = await userCollection.findOne({ _id: id });

	if (!user) {
		error(404, { message: 'User not found' });
	}

	const userPatch = UserPatchSchema.parse(await request.json());
	userPatch.updatedAt = new Date().toISOString();

	if (userPatch.currentPassword) {
		const isPasswordCorrect = await verifyPassword(userPatch.currentPassword, user.password);
		if (!isPasswordCorrect) {
			error(400, { message: 'Current password is incorrect' });
		}
	}

	if (userPatch.username) {
		const existingUser = await userCollection.findOne({ username: userPatch.username });
		if (existingUser) {
			error(400, { message: 'Username already exists' });
		}
	}

	if (userPatch.password) {
		userPatch.password = await hashPassword(userPatch.password);
	}

	await userCollection.updateOne({ _id: id }, { $set: userPatch });
	const updatedUser = await userCollection.findOne({ _id: id });

	if (!updatedUser) {
		error(404, { message: 'User not found' });
	}

	const { password, ...updatedUserWithoutPassword } = updatedUser;

	return new Response(JSON.stringify(updatedUserWithoutPassword), { status: 200 });
};
