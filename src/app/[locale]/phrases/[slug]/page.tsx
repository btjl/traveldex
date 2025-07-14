import { PhraseCard } from "@/components/PhraseCard";
import { locales } from "@/i18n/i18n";
import { Link } from "@/i18n/navigation";
import type { Messages, PhraseJsonItem } from "@/types/messages";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { createTranslator } from "use-intl/core";

export async function generateStaticParams() {
  const messages = (await import(`@/i18n/locales/en.json`)).default as Messages;
  const categorySlugs = Object.keys(messages.Phrases || {});

  return locales.flatMap((locale) =>
    categorySlugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

type CategorySlug = keyof Messages["Phrases"];

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: CategorySlug;
  }>;
  searchParams?: Promise<{
    translateTo?: string;
  } | undefined>;
}


export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug: categorySlug, locale: currentLocale } = await params;
  const search = searchParams ? await searchParams : {};
  const { translateTo } = search || {};

  const targetTranslationLocale = translateTo || currentLocale;

  // Load messages for main and target locales
  const mainMessages = (await getMessages({ locale: currentLocale })) as Messages;
  let targetMessages: Messages;
  if (currentLocale === targetTranslationLocale) {
    targetMessages = mainMessages;
  } else {
    try {
      targetMessages = (await getMessages({
        locale: targetTranslationLocale,
      })) as Messages;
    } catch {
      targetMessages = mainMessages;
    }
  }

  // Create translators
  const tMain = createTranslator({ locale: currentLocale, messages: mainMessages });
  const tTarget = createTranslator({ locale: targetTranslationLocale, messages: targetMessages });

  // Validate category existence
  if (!mainMessages.Phrases || !(categorySlug in mainMessages.Phrases)) {
    notFound();
  }

  const categoryTitle = mainMessages.Phrases?.[categorySlug]?.title || "Unknown category";

  // Get raw phrase items
  const phraseItemsMain: PhraseJsonItem[] = tMain.raw(`Phrases.${categorySlug}.items`);
  const phraseItemsTarget: PhraseJsonItem[] = tTarget.raw(`Phrases.${categorySlug}.items`);

  if (!Array.isArray(phraseItemsMain) || !Array.isArray(phraseItemsTarget)) {
    notFound();
  }

  const translationsMap = new Map(phraseItemsTarget.map((item) => [item.id, item.base]));

  const phrasesToDisplay = phraseItemsMain.map((item) => ({
    key: item.key,
    phrase: item.base,
    translation: translationsMap.get(item.id) || item.base,
  }));

  return (
    <main className="min-h-screen font-sans">
      <div className="w-full max-w-[400px] mx-auto flex flex-col">
        <header className="p-4 flex items-center gap-x-4 sticky top-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
          <Link
            href={{
              pathname: "/",
              query: translateTo ? { translateTo } : undefined,
            }}
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
          >
            <IoChevronBack className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">{categoryTitle}</h1>
        </header>

        <section className="p-4 flex flex-col gap-y-3">
          {phrasesToDisplay.map((p) => (
            <PhraseCard
              key={p.key}
              phrase={p.phrase}
              translation={p.translation}
              translatedLocale={targetTranslationLocale}
              categorySlug={categorySlug}
              phraseKey={p.key}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
