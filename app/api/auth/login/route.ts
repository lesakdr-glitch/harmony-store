import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { createSession } from '@/lib/session';

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
    await createSession(user);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при входе' },
      { status: 401 }
    );
  }
}
