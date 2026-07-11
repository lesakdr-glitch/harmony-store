import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    let query = supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .eq('active', true)
      .eq('in_stock', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Сортировка
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user || !['admin', 'seller'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...body,
        seller_id: session.user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user || !['admin', 'seller'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await request.json();

    // Проверка прав
    if (session.user.role === 'seller') {
      const { data: product } = await supabase
        .from('products')
        .select('seller_id')
        .eq('id', id)
        .single();

      if (product?.seller_id !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user || !['admin', 'seller'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Проверка прав
    if (session.user.role === 'seller') {
      const { data: product } = await supabase
        .from('products')
        .select('seller_id')
        .eq('id', id)
        .single();

      if (product?.seller_id !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}