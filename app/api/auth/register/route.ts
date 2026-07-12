import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Валидация
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    // Проверка существования пользователя
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
    }

    // Хеширование пароля
    const passwordHash = await hashPassword(password);

    // Создание пользователя
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        phone,
        role: 'customer',
      })
      .select('id, email, name, phone, role')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при создании пользователя' }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
