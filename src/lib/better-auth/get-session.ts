'use server';
import { headers } from 'next/headers';
import { auth } from './auth';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import forbidden from '@/app/forbidden';

export const getServerSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const isAuthenticated = cache(async () => {
  const { user, session } = await getServerSession();
  if (!user || !session) {
    return redirect('/login');
  }
});

export const isAdmin = cache(async () => {
  const { user } = await getServerSession();
  if (user.role !== 'admin') {
    return forbidden();
  }
});
