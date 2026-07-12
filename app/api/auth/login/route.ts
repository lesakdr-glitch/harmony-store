import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Валидация
    if (!email || !password) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    // Поиск пользователя
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    // Проверка пароля
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    // Возврат пользователя без пароля
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
