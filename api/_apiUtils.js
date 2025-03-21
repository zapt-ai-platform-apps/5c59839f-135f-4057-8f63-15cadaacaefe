import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import Sentry from './_sentry.js';
import { initializeZapt } from '@zapt/zapt-js';

const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

export async function getDbClient() {
  const client = postgres(process.env.COCKROACH_DB_URL);
  return drizzle(client);
}

export function handleApiError(res, error, message = 'Internal Server Error') {
  console.error(error);
  Sentry.captureException(error);
  return res.status(500).json({ error: message });
}

export async function authenticateUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    throw new Error('Invalid token');
  }

  // Check if the user has the correct email
  if (user.email !== 'david@mapt.events') {
    throw new Error('Unauthorized access: only david@mapt.events can access this API');
  }

  return user;
}