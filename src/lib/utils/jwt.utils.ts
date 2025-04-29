import { JWT_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';
import type { User } from '$lib/models/user/user.type';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const JWTSECRET = JWT_SECRET || 'meditrack-secret';

export function generateToken(user: User) {
	const { password, ...restUser } = user;
	const payload = restUser;

	const accessToken = jwt.sign(payload, JWTSECRET, { expiresIn: '5m' });
	const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
	return { accessToken, refreshToken };
}

export function generateAccessToken(user: User) {
	const { password, ...restUser } = user;
	const payload = restUser;
	return jwt.sign(payload, JWTSECRET, { expiresIn: '10s' });
}

export function verifyAccessToken(token: string): JwtPayload {
	try {
		return jwt.verify(token, JWTSECRET) as JwtPayload;
	} catch (error) {
		console.error('error', error);
		throw new Error('Invalid token');
	}
}

export function verifyRefreshToken(token: string): JwtPayload {
	try {
		return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
	} catch (error) {
		throw new Error('Invalid refresh token');
	}
}

export function isTokenExpired(token: string) {
	const decoded = jwt.decode(token) as JwtPayload;
	if (!decoded) {
		return true;
	}
	return decoded.exp && decoded.exp < Date.now();
}

export function isTokenExpiringSoon(token: string) {
	const decoded = jwt.decode(token) as JwtPayload;
	if (!decoded) {
		return true;
	}
	return decoded.exp && decoded.exp < Date.now() + 60_000; // 1 minute
}
