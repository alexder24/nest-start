import { registerAs } from '@nestjs/config';
import { envSchema } from './env.schema.js';

export function readDatabaseConfig() {
  const env = envSchema.parse(process.env);

  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    statementTimeoutMs: env.DB_STATEMENT_TIMEOUT_MS,
  };
}

export default registerAs('database', readDatabaseConfig);
