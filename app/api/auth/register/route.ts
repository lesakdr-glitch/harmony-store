import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { registerUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, пароль и имя обязательны' },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    // Валидация пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен быть не менее 6 символов' },
        { status: 400 }
      );
    }

    // Регистрация пользователя
    const user = await registerUser(email, password, name, phone);

    // Сохранение в сессии
    const session = await getSession();
    session.user = user;
    await session.save();

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при регистрации' },
      { status: 400 }
    );
  }
}