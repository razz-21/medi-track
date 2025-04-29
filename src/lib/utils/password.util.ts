import { hash, compare } from 'bcrypt-ts';

export async function hashPassword(password: string) {
	return await hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
	return await compare(password, hashedPassword);
}
