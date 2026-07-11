import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import { updateUserProfile } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, phone, address, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users: data || [] });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { user_id, role, ...profileUpdates } = body;

    // Обновление роли (только админ)
    if (role && user_id) {
      if (!session.user || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Только администраторы могут менять роли' }, { status: 403 });
      }

      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', user_id)
        .select('id, email, name, phone, address, role, created_at')
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, user: data });
    }

    // Обновление профиля текущего пользователя
    if (!session.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const user = await updateUserProfile(session.user.id, profileUpdates);
    
    // Обновление сессии
    session.user = { ...session.user, ...user };
    await session.save();

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}