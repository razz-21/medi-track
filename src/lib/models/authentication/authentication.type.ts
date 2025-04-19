import type { AuthLoginSchema } from './authentication.schema';
import type { z } from 'zod';

export type AuthLogin = z.infer<typeof AuthLoginSchema>;
