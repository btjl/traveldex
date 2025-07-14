// src/components/LanguageSwitcher.tsx
"use client"

import { localeInfo, locales, } from '@/i18n/i18n';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { useEffect, useState } from 'react';

interface LanguageSwitcherProps {
  type: 'main' | 'translated';
}

export function LanguageSwitcher({ type }: LanguageSwitcherProps) {
  const currentLocale = useLocale(); // This is the main app locale
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // State for the translated locale, initialized from URL search params
  const [translatedLocale, setTranslatedLocale] = useState<string | null>(null);

  useEffect(() => {
    if (type === 'translated') {
      const paramLocale = searchParams.get('translateTo');
      setTranslatedLocale(paramLocale || locales[0]); // Default to first locale if not set
    }
  }, [searchParams, type]);


  const displayedLocale = type === 'main' ? currentLocale : (translatedLocale || currentLocale);

  const handleLocaleChange = (locale: string) => {
    // Prevent changing to the same locale
    if (locale === displayedLocale) return;

    if (type === 'main') {
      router.push(pathname, { locale });
    } else {
      setTranslatedLocale(locale);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('translateTo', locale);
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
    setIsOpen(false);
  };


  return (
    <div className="relative inline-block text-left">
      <button
        className="text-gray-700 px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {localeInfo[displayedLocale as keyof typeof localeInfo]?.flag}
        <span className="ml-2">{localeInfo[displayedLocale as keyof typeof localeInfo]?.name}</span>
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1" role="none">
            {locales
              .filter((locale) =>
                type === 'main'
                  ? locale !== currentLocale
                  : locale !== (translatedLocale || currentLocale)
              )
              .map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className="text-gray-700 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                  role="menuitem"
                  tabIndex={-1}
                >
                  {localeInfo[locale]?.flag}
                  <span className="ml-2">{localeInfo[locale]?.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}