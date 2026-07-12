import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    // Заказы за сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { data: todayOrders } = await supabaseAdmin
      .from('orders')
      .select('total_price')
      .gte('created_at', todayISO);

    const ordersToday = todayOrders?.length || 0;
    const revenueToday = todayOrders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

    // Всего заказов
    const { count: totalOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Всего товаров
    const { count: totalProducts } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true });

    // График выручки за 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select('created_at, total_price')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Группировка по дням
    const chartByDate: Record<string, { date: string; revenue: number }> = {};
    
    recentOrders?.forEach((order: any) => {
      const date = new Date(order.created_at).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
      });
      if (!chartByDate[date]) {
        chartByDate[date] = { date, revenue: 0 };
      }
      chartByDate[date].revenue += order.total_price || 0;
    });

    const chartData = Object.values(chartByDate);

    // Последние 10 заказов
    const { data: latestOrders } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      ordersToday,
      revenueToday,
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      chartData,
      recentOrders: latestOrders || [],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
