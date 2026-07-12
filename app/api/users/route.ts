import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function isAdmin(request: NextRequest): boolean {
  return request.headers.get('x-user-role') === 'admin';
}

function getCurrentUserId(request: NextRequest): string | null {
  return request.headers.get('x-user-id');
}

// GET — список всех пользователей (только для admin)
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, phone, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Ошибка загрузки пользователей' }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

// PATCH — обновить роль пользователя (только для admin)
export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminId = getCurrentUserId(request);
  const body = await request.json();
  const { userId, role } = body;

  if (!userId || !role) {
    return NextResponse.json({ error: 'userId и role обязательны' }, { status: 400 });
  }

  const validRoles = ['customer', 'seller', 'admin'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Недопустимая роль' }, { status: 400 });
  }

  // Нельзя менять свою роль
  if (userId === adminId) {
    return NextResponse.json({ error: 'Нельзя изменить свою роль' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select('id, name, email, role')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Ошибка обновления роли' }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}
