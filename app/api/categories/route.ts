import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';

// GET - публичный доступ
export async function GET() {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      return NextResponse.json({ error: 'Ошибка при загрузке категорий' }, { status: 500 });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - только для админов
export async function POST(request: NextRequest) {
  try {
    const userHeader = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!isAdmin({ id: userHeader, role: userRole })) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при создании категории' }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH - только для админов
export async function PATCH(request: NextRequest) {
  try {
    const userHeader = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!isAdmin({ id: userHeader, role: userRole })) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при обновлении категории' }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE - только для админов
export async function DELETE(request: NextRequest) {
  try {
    const userHeader = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!isAdmin({ id: userHeader, role: userRole })) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Ошибка при удалении категории' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
