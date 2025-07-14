// src/components/CategoryCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useParams, useSearchParams } from "next/navigation";
import type { IconType } from "react-icons";
import { Link } from "../i18n/navigation";

interface CategoryCardProps {
  href: string;
  icon: IconType;
  title: string;
}

export function CategoryCard({ href, icon: Icon, title }: CategoryCardProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const translateTo = searchParams.get("translateTo");
  const locale = params.locale ?? "en";

  const url = new URL(href, `http://example.com/${locale}`);
  if (translateTo) {
    url.searchParams.set("translateTo", translateTo);
  }

  const fullHref = `${url.pathname}${url.search}`;

  return (
    <Link href={fullHref} className="block">
      <Card className="group hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md border border-slate-200 rounded-xl bg-white">
        <CardContent className="flex flex-col items-center justify-center gap-y-1.5 p-4">
          <Icon className="w-8 h-8 text-slate-500 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors text-center">
            {title}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
