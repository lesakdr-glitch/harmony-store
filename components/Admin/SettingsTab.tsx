'use client';

import { useEffect, useState } from 'react';
import { Settings } from '@/lib/supabase';

export default function SettingsTab() {
  const [settings, setSettings] = useState<Partial<Settings>>({
    whatsapp_number: '',
    telegram_chat_id: '',
    telegram_bot_token: '',
    support_telegram: '',
    sold_today: 0,
    pickup_address: '',
    hero_badge_text: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', { credentials: 'include' });
      const data = await response.json();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Зелёная плашка успеха
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMsg.textContent = '✓ Настройки сохранены';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } else {
        const errorData = await response.json();
        alert('Ошибка: ' + (errorData.details || 'Не удалось сохранить'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-secondary">Загрузка...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Настройки</h2>

      <form onSubmit={handleSave} className="bg-card p-8 rounded-card space-y-6">
        <div>
          <label className="block text-text mb-2 font-medium">Номер WhatsApp</label>
          <input
            type="text"
            value={settings.whatsapp_number || ''}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            placeholder="79001234567"
          />
          <p className="text-secondary text-sm mt-2">
            Для плавающей кнопки (без + и пробелов)
          </p>
        </div>

        <div>
          <label className="block text-text mb-2 font-medium">Telegram Bot Token</label>
          <input
            type="text"
            value={settings.telegram_bot_token || ''}
            onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
          />
          <p className="text-secondary text-sm mt-2">
            Токен бота от @BotFather
          </p>
        </div>

        <div>
          <label className="block text-text mb-2 font-medium">Telegram Chat ID</label>
          <input
            type="text"
            value={settings.telegram_chat_id || ''}
            onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            placeholder="123456789"
          />
          <p className="text-secondary text-sm mt-2">
            ID чата куда отправлять уведомления (получите у @userinfobot)
          </p>
        </div>

        <div>
          <label className="block text-text mb-2 font-medium">Telegram Support Username</label>
          <input
            type="text"
            value={settings.support_telegram || ''}
            onChange={(e) => setSettings({ ...settings, support_telegram: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            placeholder="Smartstoretech"
          />
          <p className="text-secondary text-sm mt-2">
            Username Telegram для поддержки (без @). Используется в плавающей кнопке и боте.
          </p>
        </div>

        <div>
          <label className="block text-text mb-2 font-medium">Адрес самовывоза</label>
          <input
            type="text"
            value={settings.pickup_address || ''}
            onChange={(e) => setSettings({ ...settings, pickup_address: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            placeholder="г. Новороссийск, ул. Примерная, 1"
          />
          <p className="text-secondary text-sm mt-2">
            Отображается при выборе самовывоза в форме заказа
          </p>
        </div>

        <div>
          <label className="block text-text mb-2 font-medium">Текст на плашке Hero</label>
          <input
            type="text"
            value={settings.hero_badge_text || ''}
            onChange={(e) => setSettings({ ...settings, hero_badge_text: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            placeholder="Premium Quality"
          />
          <p className="text-secondary text-sm mt-2">
            Плашка в правом верхнем углу Hero-секции (оставьте пустым чтобы скрыть)
          </p>
        </div>

        <div>
          <label className="block text-text mb-2 font-medium">Продано сегодня</label>
          <input
            type="number"
            value={settings.sold_today || 0}
            onChange={(e) => setSettings({ ...settings, sold_today: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            placeholder="5"
          />
          <p className="text-secondary text-sm mt-2">
            Счётчик на главной странице (обновляется автоматически каждый день)
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить настройки'}
        </button>
      </form>
    </div>
  );
}
