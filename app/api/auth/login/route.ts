import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loginUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    const user = await loginUser(email, password);

    const session = await getSession();
    session.user = user;
    await session.save();

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при входе' },
      { status: 401 }
    );
  }
}
