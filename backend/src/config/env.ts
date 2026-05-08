import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try multiple locations for .env — handles tsx ESM mode where __dirname may differ
const candidates = [
  path.resolve(process.cwd(), '../.env'),   // running from backend/ → root/.env
  path.resolve(process.cwd(), '.env'),       // running from root/
  path.resolve(process.cwd(), '../../.env'), // fallback
];
for (const candidate of candidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}\nAdd it to the .env file in the project root.`);
  return value;
}

// ANTHROPIC_API_KEY is optional at startup — AI features degrade gracefully if absent
function optionalEnv(name: string): string {
  return process.env[name] ?? '';
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),

  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  ANTHROPIC_API_KEY: optionalEnv('ANTHROPIC_API_KEY'),

  DATABASE_PATH: process.env.DATABASE_PATH || './data/soc2.db',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),

  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV !== 'production',
};
