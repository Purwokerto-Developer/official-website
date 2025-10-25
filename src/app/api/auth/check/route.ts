import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/better-auth/get-session';

export async function GET() {
  try {
    const session = await getServerSession();
    const authenticated = !!(
      session &&
      (session.user || (session as any).id || (session as any).email)
    );
    return NextResponse.json({ authenticated });
  } catch (err) {
    return NextResponse.json({ authenticated: false });
  }
}
