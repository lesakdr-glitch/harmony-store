import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    if (!process.env.ADMIN_PASSWORD) {
      console.error('[Auth] ADMIN_PASSWORD is not configured');
      return NextResponse.json(
        { error: 'Admin login is not configured' },
        { status: 500 }
      );
    }

    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
      console.error('[Auth] SESSION_SECRET must be at least 32 characters');
      return NextResponse.json(
        { error: 'Session is not configured' },
        { status: 500 }
      );
    }

    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const session = await getSession();
    session.isAdmin = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Auth] Login failed:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
