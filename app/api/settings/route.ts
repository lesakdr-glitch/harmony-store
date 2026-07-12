import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminPassword } from '@/lib/auth';

// GET - публичный доступ (без токенов)
export async function GET() {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при загрузке настроек' }, { status: 500 });
    }

    // Исключаем токены из публичного ответа
    const { telegram_bot_token, ...publicSettings } = settings;

    return NextResponse.json(publicSettings);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH - только для админов
export async function PATCH(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!verifyAdminPassword(adminPassword || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('settings')
      .update(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при обновлении настроек' }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
