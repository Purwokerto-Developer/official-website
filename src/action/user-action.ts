import { db } from '@/db';
import { user } from '../db/schema/auth-schema';
import { asc } from 'drizzle-orm';
import { fail, success } from '@/lib/return-helper';
export async function getUsers() {
  try {
    const result = await db.select().from(user).orderBy(asc(user.name));
    return success(result);
  } catch (error) {
    console.error('Get users failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to fetch users');
  }
}
