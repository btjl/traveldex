// src/lib/i18n.ts

export const locales = ['en', 'cn', "ms", "ta"]; // Add all your supported locales here
export const defaultLocale = 'en';

export const localeInfo: Record<string, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  cn: { name: 'Chinese', flag: '🇨🇳' },
  ms: { name: 'Malay', flag: '🇲🇾' },
  ta: { name: 'Tamil', flag: '🇮🇳' }
};