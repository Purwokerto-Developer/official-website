'use server';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  if (result.success) {
    redirect('/login');
  }
  return result;
};

export const signInGoogle = async (callbackURL: string = '/u/dashboard') => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider: 'google',
      callbackURL,
    },
  });

  if (url) {
    redirect(url);
  }
};

export const signInGithub = async (callbackURL: string = '/u/dashboard') => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider: 'github',
      callbackURL,
    },
  });
  if (url) {
    redirect(url);
  }
};
