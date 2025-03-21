import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import Sentry from './_sentry.js';

export async function getDbClient() {
  const client = postgres(process.env.COCKROACH_DB_URL);
  return drizzle(client);
}

export function handleApiError(res, error, message = 'Internal Server Error') {
  console.error(error);
  Sentry.captureException(error);
  return res.status(500).json({ error: message });
}