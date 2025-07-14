"use client";

import { defaultLocale, locales } from "@/i18n/i18n";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function EnsureLocaleAndTranslateParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const segments = pathname.split("/");
    // Extract locale from path, assuming /[locale]/...
    let pathLocale = segments[1];

    // Check if locale is valid
    if (!locales.includes(pathLocale)) {
      pathLocale = defaultLocale;
    }

    const translateTo = searchParams.get("translateTo");

    // If translateTo is invalid or missing, default to first locale (e.g. 'en')
    const translateToLocale = translateTo && locales.includes(translateTo) ? translateTo : locales[0];

    const localeMismatch = segments[1] !== pathLocale;
    const missingTranslateTo = translateTo !== translateToLocale;

    if (localeMismatch || missingTranslateTo) {
      // Fix the URL: replace or insert locale in path
      if (locales.includes(segments[1])) {
        segments[1] = pathLocale;
      } else {
        segments.splice(1, 0, pathLocale);
      }

      // Rebuild search params with correct translateTo
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("translateTo", translateToLocale);

      const newUrl = `${segments.join("/")}?${newSearchParams.toString()}`;

      router.replace(newUrl);
    }
  }, [pathname, searchParams, router]);

  return null;
}
