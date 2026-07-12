import bcrypt from 'bcryptjs';

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Проверка админ-прав по роли пользователя
export function isAdmin(user: any): boolean {
  return user && user.role === 'admin';
}

// Проверка админ-пароля (для простой админки) - deprecated
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return password === adminPassword;
}
