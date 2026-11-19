import path from 'node:path';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  TECHLAB_DB_PATH: z
    .string()
    .default('data/techlab.db')
    .transform((val) => path.resolve(process.cwd(), val)),
  PORT: z.coerce.number().optional().default(3000),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    TECHLAB_DB_PATH: process.env.TECHLAB_DB_PATH,
    PORT: process.env.PORT,
  });
}

export const env = getEnv();
