'use server';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { auth } from './auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { nextCookies } from 'better-auth/next-js';
import { adminClient } from 'better-auth/client/plugins';
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/',
  plugins: [nextCookies(), inferAdditionalFields<typeof auth>(), adminClient()],
});
export const { useSession } = authClient;

// google sign in
export const signInGoogle = async () => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider: 'google',
      callbackURL: '/u/dashboard',
    },
  });

  if (url) {
    redirect(url);
  }
};

// github sign in
export const signInGithub = async () => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider: 'github',
      callbackURL: '/u/dashboard',
    },
  });
  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });

  return result;
};
