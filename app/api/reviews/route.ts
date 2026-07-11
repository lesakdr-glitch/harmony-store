import { NextResponse } from 'next/server';
import { isAdminAuthenticated, requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    const isAdmin = await isAdminAuthenticated(session);

    let query = supabaseAdmin.from('reviews').select('*').order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    const normalized = (data || []).map((review) => ({
      ...review,
      rating: review.stars || review.rating || 5,
    }));

    return NextResponse.json(normalized);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Reviews] Error fetching reviews:', message);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const authError = await requireAdmin(session);
  if (authError) return NextResponse.json(authError, { status: authError.status });

  try {
    const body = await request.json();

    const reviewData = {
      name: body.name,
      city: body.city,
      text: body.text,
      stars: body.rating || body.stars || 5,
      avatar_url: body.avatar_url,
      active: body.active ?? true,
    };

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Reviews] Error creating review:', message);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  const authError = await requireAdmin(session);
  if (authError) return NextResponse.json(authError, { status: authError.status });

  try {
    const body = await request.json();
    const { id, rating, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const updateData = {
      ...rest,
      ...(rating !== undefined && { stars: rating }),
    };

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Reviews] Error updating review:', message);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  const authError = await requireAdmin(session);
  if (authError) return NextResponse.json(authError, { status: authError.status });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Reviews] Error deleting review:', message);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
