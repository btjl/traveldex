"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeInfo, locales } from "@/i18n/i18n";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface LanguageSwitcherProps {
  type: "main" | "translated";
}

export function LanguageSwitcher({ type }: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [translatedLocale, setTranslatedLocale] = useState<string | null>(null);

  useEffect(() => {
    if (type === "translated") {
      const paramLocale = searchParams.get("translateTo");
      setTranslatedLocale(paramLocale || locales[0]);
    }
  }, [searchParams, type]);

  const displayedLocale =
    type === "main" ? currentLocale : translatedLocale || currentLocale;

  const handleLocaleChange = (locale: string) => {
    if (locale === displayedLocale) return;

    if (type === "main") {
      router.push(pathname, { locale });
    } else {
      setTranslatedLocale(locale);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("translateTo", locale);
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {localeInfo[displayedLocale as keyof typeof localeInfo]?.flag}
          <span className="capitalize">
            {localeInfo[displayedLocale as keyof typeof localeInfo]?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales
          .filter((locale) =>
            type === "main"
              ? locale !== currentLocale
              : locale !== (translatedLocale || currentLocale)
          )
          .map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className="flex items-center gap-2"
            >
              {localeInfo[locale]?.flag}
              <span>{localeInfo[locale]?.name}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
