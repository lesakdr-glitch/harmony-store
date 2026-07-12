import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PATCH - обновление профиля
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ...updateData } = body;

    if (!email) {
      return NextResponse.json({ error: 'Не указан email' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('email', email)
      .select('id, email, name, phone, role')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при обновлении профиля' }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
