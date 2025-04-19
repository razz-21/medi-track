import type { AuthLogin } from '$lib/models/authentication/authentication.type';
import userCollection from '$lib/server/mongo/collections/user.collection.js';
import { verifyPassword } from '$lib/utils/password.util.js';
import { generateToken } from '$lib/utils/jwt.utils.js';
import { AUTH_STORAGE_KEY, REFRESH_STORAGE_KEY } from '$lib/models/common/constants';

export async function POST({ request, cookies }) {
	const { username, password }: AuthLogin = await request.json();

	const user = await userCollection.findOne({ username });

	if (!user) {
		return new Response(
			JSON.stringify({
				message:
					'There is no user under this username. Contact your administrator if you think this is an error.'
			}),
			{
				status: 401
			}
		);
	}

	const verified = await verifyPassword(password, user.password);
	if (!verified) {
		return new Response(JSON.stringify({ message: 'Invalid username or password' }), {
			status: 401
		});
	}

	const { accessToken, refreshToken } = generateToken(user);
	const { password: userPassword, ...restUser } = user;

	cookies.set(AUTH_STORAGE_KEY, accessToken, {
		path: '/',
		httpOnly: true,
		maxAge: 15 * 60, // 15 minutes
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production'
	});

	cookies.set(REFRESH_STORAGE_KEY, refreshToken, {
		path: '/',
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60, // 7 days
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production'
	});

	return new Response(
		JSON.stringify({ message: 'Login successful', accessToken, refreshToken, user: restUser }),
		{
			status: 200,
			headers: {
				'Set-Cookie': `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=15m; SameSite=Strict;`
			}
		}
	);
}
