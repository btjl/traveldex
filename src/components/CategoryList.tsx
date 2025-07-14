"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { BsBag } from "react-icons/bs";
import { FaRegCompass } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { LuHash, LuHeartPulse, LuHotel, LuSpeech } from "react-icons/lu";
import { MdOutlineDirectionsTransit } from "react-icons/md";



export function CategoryList() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const searchParams = useSearchParams();

  const translateToParam = searchParams.get("translateTo");
  const translatedLocale =
    translateToParam && translateToParam !== currentLocale
      ? translateToParam
      : "en"; // fallback to English if same or missing

  const categories = [
    {
      title: t("Categories.greetings", { locale: translatedLocale }),
      icon: LuSpeech,
      slug: "greetings",
    },
    {
      title: t("Categories.transport", { locale: translatedLocale }),
      icon: MdOutlineDirectionsTransit,
      slug: "transport",
    },
    {
      title: t("Categories.hotel", { locale: translatedLocale }),
      icon: LuHotel,
      slug: "hotel",
    },
    {
      title: t("Categories.dining", { locale: translatedLocale }),
      icon: IoFastFoodOutline,
      slug: "dining",
    },
    {
      title: t("Categories.directions", { locale: translatedLocale }),
      icon: FaRegCompass,
      slug: "directions",
    },
    {
      title: t("Categories.shopping", { locale: translatedLocale }),
      icon: BsBag,
      slug: "shopping",
    },
    {
      title: t("Categories.emergency", { locale: translatedLocale }),
      icon: LuHeartPulse,
      slug: "emergency",
    },
    {
      title: t("Categories.basics", { locale: translatedLocale }),
      icon: LuHash,
      slug: "basics",
    },
  ];

  return (
    <section className="p-4 grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.slug}
          href={`/phrases/${category.slug}`}
          icon={category.icon}
          title={category.title}
        />
      ))}
    </section>
  );
}