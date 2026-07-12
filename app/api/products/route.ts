import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminPassword } from '@/lib/auth';

// GET - публичный доступ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('category_id');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    let query = supabaseAdmin
      .from('products')
      .select('*, categories(name)')
      .eq('active', true);

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (min_price) {
      query = query.gte('price', parseInt(min_price));
    }

    if (max_price) {
      query = query.lte('price', parseInt(max_price));
    }

    // Сортировка
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('views_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Пагинация
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Ошибка при загрузке товаров' }, { status: 500 });
    }

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - только для админов
export async function POST(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!verifyAdminPassword(adminPassword || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при создании товара' }, { status: 500 });
    }

    return NextResponse.json({ product: data });
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
    const { id, ...updateData } = body;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при обновлении товара' }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE - только для админов
export async function DELETE(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!verifyAdminPassword(adminPassword || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Ошибка при удалении товара' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
