'use server';
import { headers } from 'next/headers';
import { auth } from './auth';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import forbidden from '@/app/forbidden';

export const getServerSession = cache(async () => {
  const h = await headers();
  return auth.api.getSession({ headers: h });
});

export const isAuthenticated = cache(async () => {
  const result = await getServerSession();
  const user = result?.user ?? null;
  const session = result?.session ?? null;
  if (!user || !session) {
    return redirect('/login');
  }
  return { user, session };
});

export const isAdmin = cache(async () => {
  const result = await getServerSession();
  const user = result?.user ?? null;
  if (!user || user.role !== 'admin') {
    return forbidden();
  }
  return user;
});
