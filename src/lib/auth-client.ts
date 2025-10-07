'use server';
import { createAuthClient } from 'better-auth/react';
import { auth } from './auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api/auth',
});
export const { useSession } = authClient;
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
