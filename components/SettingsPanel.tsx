'use client';

import { useEffect, useState } from 'react';

interface SettingsForm {
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  delivery_text: string;
  return_text: string;
  privacy_text: string;
  terms_text: string;
  support_telegram: string;
  contact_phone: string;
  contact_email: string;
  inn_ogrn: string;
  sbp_qr_url: string;
  pickup_address: string;
}

const EMPTY: SettingsForm = {
  hero_title: '',
  hero_subtitle: '',
  about_text: '',
  delivery_text: '',
  return_text: '',
  privacy_text: '',
  terms_text: '',
  support_telegram: '',
  contact_phone: '',
  contact_email: '',
  inn_ogrn: '',
  sbp_qr_url: '',
  pickup_address: '',
};

export default function SettingsPanel() {
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setForm({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          about_text: data.about_text || '',
          delivery_text: data.delivery_text || '',
          return_text: data.return_text || '',
          privacy_text: data.privacy_text || '',
          terms_text: data.terms_text || '',
          support_telegram: data.support_telegram || '',
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          inn_ogrn: data.inn_ogrn || '',
          sbp_qr_url: data.sbp_qr_url || '',
          pickup_address: data.pickup_address || '',
        });
      })
      .catch(() => setMessage('Ошибка загрузки настроек'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id || '',
          'x-user-role': user.role || '',
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('✅ Сохранено');
      } else {
        setMessage('❌ Ошибка сохранения');
      }
    } catch {
      setMessage('❌ Ошибка сервера');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const set = (key: keyof SettingsForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  if (loading) return <p className="text-text-secondary">Загрузка...</p>;

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive bg-white dark:bg-gray-800 text-sm';
  const textareaClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive bg-white dark:bg-gray-800 text-sm resize-y';
  const labelClass = 'block text-sm font-medium mb-2 text-text-secondary';
  const sectionClass = 'bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm space-y-4';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">Настройки сайта</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent-olive text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium">
          {message}
        </div>
      )}

      {/* Главная страница */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-text-primary mb-2">Главная страница (Hero)</h3>
        <div>
          <label className={labelClass}>Заголовок</label>
          <input type="text" value={form.hero_title} onChange={set('hero_title')} className={inputClass} placeholder="Harmony Store" />
        </div>
        <div>
          <label className={labelClass}>Подзаголовок</label>
          <input type="text" value={form.hero_subtitle} onChange={set('hero_subtitle')} className={inputClass} placeholder="Продукция Vilavi..." />
        </div>
      </div>

      {/* Текстовые страницы */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-text-primary mb-2">Текстовые страницы</h3>
        <div>
          <label className={labelClass}>О нас (/about)</label>
          <textarea rows={5} value={form.about_text} onChange={set('about_text')} className={textareaClass} placeholder="Расскажите о компании..." />
        </div>
        <div>
          <label className={labelClass}>Доставка и оплата (/delivery)</label>
          <textarea rows={5} value={form.delivery_text} onChange={set('delivery_text')} className={textareaClass} placeholder="Условия доставки..." />
        </div>
        <div>
          <label className={labelClass}>Возврат товара (/returns)</label>
          <textarea rows={5} value={form.return_text} onChange={set('return_text')} className={textareaClass} placeholder="Условия возврата..." />
        </div>
        <div>
          <label className={labelClass}>Политика конфиденциальности (/privacy)</label>
          <textarea rows={5} value={form.privacy_text} onChange={set('privacy_text')} className={textareaClass} placeholder="Политика конфиденциальности..." />
        </div>
        <div>
          <label className={labelClass}>Условия использования (/terms)</label>
          <textarea rows={5} value={form.terms_text} onChange={set('terms_text')} className={textareaClass} placeholder="Условия использования..." />
        </div>
      </div>

      {/* Контакты */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-text-primary mb-2">Контакты</h3>
        <div>
          <label className={labelClass}>Telegram поддержки (без @)</label>
          <input type="text" value={form.support_telegram} onChange={set('support_telegram')} className={inputClass} placeholder="harmonystore" />
        </div>
        <div>
          <label className={labelClass}>Телефон</label>
          <input type="text" value={form.contact_phone} onChange={set('contact_phone')} className={inputClass} placeholder="+7 (999) 123-45-67" />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={form.contact_email} onChange={set('contact_email')} className={inputClass} placeholder="support@harmonystore.ru" />
        </div>
        <div>
          <label className={labelClass}>Реквизиты (ИНН/ОГРН)</label>
          <input type="text" value={form.inn_ogrn} onChange={set('inn_ogrn')} className={inputClass} placeholder="ИНН 1234567890 | ОГРН 1234567890123" />
        </div>
      </div>

      {/* Прочее */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-text-primary mb-2">Прочее</h3>
        <div>
          <label className={labelClass}>Ссылка на QR СБП</label>
          <input type="text" value={form.sbp_qr_url} onChange={set('sbp_qr_url')} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label className={labelClass}>Адрес самовывоза</label>
          <input type="text" value={form.pickup_address} onChange={set('pickup_address')} className={inputClass} placeholder="Москва, ул. Примерная, 1" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent-olive text-white px-8 py-3 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
}
