import { AUTH_STORAGE_KEY, REFRESH_STORAGE_KEY } from '$lib/models/common/constants';
import { startMongo } from '$lib/server/mongo/mongo';
import {
	isTokenExpiringSoon,
	isTokenExpired,
	verifyAccessToken,
	verifyRefreshToken,
	generateAccessToken
} from '$lib/utils/jwt.utils';
import { redirect, type Handle, type HandleServerError, type ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_ROUTES, Routes } from '$lib/models/navigation/routes';
import userCollection from '$lib/server/mongo/collections/user.collection';

export const init: ServerInit = () => {
	startMongo()
		.then(() => {
			console.log('MongoDB connected');
		})
		.catch((e) => console.error(e));
};

const authenticationHook: Handle = async ({ event, resolve }) => {
	const requestPath = event.url.pathname;

	if (PUBLIC_ROUTES.includes(requestPath)) {
		event.locals = {
			user: null
		};
		return resolve(event);
	}

	try {
		let token =
			event.request.headers.get('Authorization')?.split(' ')[1] ||
			event.cookies.get(AUTH_STORAGE_KEY);

		if (!token) {
			console.log('NO TOKEN');
			return redirect(302, Routes.Login);
		}

		if (isTokenExpiringSoon(token) || isTokenExpired(token)) {
			const refreshToken = event.cookies.get(REFRESH_STORAGE_KEY);
			if (!refreshToken) {
				console.error('REFRESH TOKEN NOT FOUND');
				return redirect(302, Routes.Login);
			}

			const refreshTokenDecoded = verifyRefreshToken(refreshToken);
			const _id = refreshTokenDecoded._id;
			const user = await userCollection.findOne({ _id });
			if (!user) {
				console.error('USER NOT FOUND');
				return redirect(302, Routes.Login);
			}

			const newAccessToken = generateAccessToken(user);
			token = newAccessToken;

			event.cookies.set(AUTH_STORAGE_KEY, token, {
				path: '/',
				httpOnly: true,
				maxAge: 15 * 60, // 15 minutes
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production'
			});
		}

		const decoded = verifyAccessToken(token);
		event.locals = {
			user: decoded
		};

		return resolve(event);
	} catch (error) {
		console.error('error', error);
		return redirect(302, Routes.Login);
	}
};

export const handleError: HandleServerError = async ({ error }) => {
	console.error('error', error);
	// TODO
};

export const handle = sequence(authenticationHook);
