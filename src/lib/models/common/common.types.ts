import type { UUIDSchema } from './common.schema';
import type { z } from 'zod';

export type UUID = z.infer<typeof UUIDSchema>;
