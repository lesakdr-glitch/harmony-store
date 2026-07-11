import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        id,
        text,
        stars,
        created_at,
        active,
        user:users(name),
        product:products(name, slug)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const { product_id, text, stars } = await request.json();

    if (!product_id || !text || !stars) {
      return NextResponse.json(
        { error: 'Не все поля заполнены' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([
        {
          user_id: session.user.id,
          product_id,
          text,
          stars,
          active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Только админ' }, { status: 403 });
    }

    const { id, active } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({ active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Только админ' }, { status: 403 });
    }

    const { id } = await request.json();

    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
