import { verifyAccessToken } from '$lib/utils/jwt.utils';

export async function authMiddleware(request: Request) {
	const token = request.headers.get('Authorization')?.split(' ')[1];

	if (!token) {
		return new Response('Unauthorized for no token provided', { status: 401 });
	}

	try {
		const decoded = verifyAccessToken(token);

		if (!decoded) {
			return new Response('Unauthorized for invalid token', { status: 401 });
		}

		return decoded;
	} catch (error) {
		return new Response('Unauthorized for invalid token', { status: 401 });
	}
}
