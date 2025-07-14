import { CategoryList } from "@/components/CategoryList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen font-sans">
      <div className="w-full max-w-[400px] mx-auto flex flex-col">
        <header className="p-6 pt-12 text-center">
          <h1 className="text-3xl font-bold text-slate-800">{t("HomePage.title")}</h1>
          <p className="text-slate-500 mt-1">{t("HomePage.subtitle")}</p>
          <div className="mt-4 flex items-center justify-center gap-x-2">
            <LanguageSwitcher type="main" />
            <FaArrowRight />
            <LanguageSwitcher type="translated" />
          </div>
        </header>

        <CategoryList />
      </div>
    </main>
  );
}
