import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

export async function POST() {
  try {
    await clearSession();
    
    return NextResponse.json({ 
      success: true,
      message: 'Вы успешно вышли из системы'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Ошибка при выходе' },
      { status: 500 }
    );
  }
}