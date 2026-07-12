import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!verifyAdminPassword(adminPassword || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Заказы за сегодня
    const today = new Date().toISOString().split('T')[0];
    const { data: todayOrders } = await supabaseAdmin
      .from('orders')
      .select('total_price')
      .gte('created_at', today);

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
    
    const { data: chartData } = await supabaseAdmin
      .from('orders')
      .select('created_at, total_price')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    const chartByDate = chartData?.reduce((acc: any, order: any) => {
      const date = new Date(order.created_at).toLocaleDateString('ru-RU');
      if (!acc[date]) acc[date] = { date, revenue: 0 };
      acc[date].revenue += order.total_price;
      return acc;
    }, {}) || {};

    const chartDataArray = Object.values(chartByDate);

    // Последние заказы
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      ordersToday,
      revenueToday,
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      chartData: chartDataArray,
      recentOrders,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
