import bcrypt from 'bcryptjs';

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Проверка админ-пароля (для простой админки)
export function verifyAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}
