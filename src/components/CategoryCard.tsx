// src/components/CategoryCard.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import type { IconType } from "react-icons";
import { Link } from "../i18n/navigation";

interface CategoryCardProps {
  href: string;
  icon: IconType;
  title: string;
}

export function CategoryCard({ href, icon: Icon, title }: CategoryCardProps) {
  const params = useParams(); // get current params (including locale)
  const searchParams = useSearchParams();
  const translateTo = searchParams.get("translateTo");

  // Build full href with locale prefix and preserve translateTo param
  const locale = params.locale ?? 'en'; // fallback to default locale

  const url = new URL(href, `http://example.com/${locale}`); // base to build path properly
  if (translateTo) {
    url.searchParams.set('translateTo', translateTo);
  }

  return (
    <Link
      href={`${url.pathname}${url.search}`}
      className="group flex flex-col items-center justify-center gap-y-2 p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Icon className="w-8 h-8 text-slate-500 group-hover:text-blue-600 transition-colors" />
      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
        {title}
      </span>
    </Link>
  );
}