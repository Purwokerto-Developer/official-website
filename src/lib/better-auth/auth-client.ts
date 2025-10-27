import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { auth } from './auth';
import { redirect } from 'next/navigation';
import { nextCookies } from 'better-auth/next-js';
import { adminClient } from 'better-auth/client/plugins';
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/',
  plugins: [nextCookies(), inferAdditionalFields<typeof auth>(), adminClient()],
});
export const { useSession } = authClient;
