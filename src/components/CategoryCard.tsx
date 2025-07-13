import Link from "next/link";
import type { IconType } from "react-icons";

interface CategoryCardProps {
  href: string;
  icon: IconType;
  title: string;
}

export function CategoryCard({ href, icon: Icon, title }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-y-2 p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Icon className="w-8 h-8 text-slate-500 group-hover:text-blue-600 transition-colors" />
      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
        {title}
      </span>
    </Link>
  );
}
