import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  const authenticated = await isAdminAuthenticated(session);
  return NextResponse.json({ authenticated });
}
