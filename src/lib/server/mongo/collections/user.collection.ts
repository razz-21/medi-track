import db from '../mongo';
import type { User } from '$lib/models/user/user.type';

export default db.collection<User>('users');
