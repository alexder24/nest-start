import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const jwtEnvSchema = z
  .object({
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive(),
    JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive(),
  })
  .refine((env) => env.JWT_ACCESS_SECRET !== env.JWT_REFRESH_SECRET, {
    message: 'JWT access and refresh secrets must be different',
    path: ['JWT_REFRESH_SECRET'],
  });

export default registerAs('jwt', () => {
  const env = jwtEnvSchema.parse(process.env);

  return {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTtlSeconds: env.JWT_ACCESS_TTL_SECONDS,
    refreshTtlSeconds: env.JWT_REFRESH_TTL_SECONDS,
  };
});
