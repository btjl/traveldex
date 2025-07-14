// src/lib/i18n.ts

export const locales = ['en', 'cn']; // Add all your supported locales here
export const defaultLocale = 'en';

export const localeInfo: Record<string, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  cn: { name: 'Chinese', flag: '🇨🇳' },
};