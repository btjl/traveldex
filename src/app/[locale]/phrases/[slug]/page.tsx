// app/[locale]/phrases/[slug]/page.tsx

import { PhraseCard } from "@/components/PhraseCard";
import { locales } from "@/i18n/i18n";
import { Link } from "@/i18n/navigation";
import type { Messages, PhraseJsonItem } from "@/types/messages";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { createTranslator } from "use-intl/core";


export async function generateStaticParams() {
  // Load messages for one locale to get the category slugs.
  // This assumes all locales have the same set of categories.
  const messages = (await import(`@/i18n/locales/en.json`)).default as Messages;
  const categorySlugs = Object.keys(messages.Phrases || {});

  return locales.flatMap((locale) =>
    categorySlugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

interface CategoryPageProps {
  params: {
    slug: string;
    locale: string;
  };
  searchParams: {
    translateTo?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const currentLocale = params.locale;
  const targetTranslationLocale = searchParams.translateTo || currentLocale;

  // Load messages for both the main and target locales
  const mainMessages = (await getMessages({ locale: currentLocale })) as Messages;
  let targetMessages: Messages;
  if (currentLocale === targetTranslationLocale) {
    targetMessages = mainMessages;
  } else {
    try {
      // Use getMessages to safely load the target locale's messages
      targetMessages = (await getMessages({
        locale: targetTranslationLocale,
      })) as Messages;
    } catch (error) {
      console.error(
        `Could not load messages for locale "${targetTranslationLocale}". Falling back to main locale.`, error
      );
      targetMessages = mainMessages;
    }
  }

  // Create translators for both locales
  const tMain = createTranslator({ locale: currentLocale, messages: mainMessages });
  const tTarget = createTranslator({
    locale: targetTranslationLocale,
    messages: targetMessages,
  });

  // The slug from the URL is the category key.
  const categorySlug = params.slug;

  // Validate that the category exists in the messages
  if (!mainMessages.Phrases || !(categorySlug in mainMessages.Phrases)) {
    notFound();
  }

  const categoryTitle = tMain(`Phrases.${categorySlug}.title`);

  // Get the raw array of phrase items for both locales
  const phraseItemsMain: PhraseJsonItem[] = tMain.raw(
    `Phrases.${categorySlug}.items`
  );
  const phraseItemsTarget: PhraseJsonItem[] = tTarget.raw(
    `Phrases.${categorySlug}.items`
  );

  // Validate that the phrase data is structured as expected
  if (!Array.isArray(phraseItemsMain) || !Array.isArray(phraseItemsTarget)) {
    console.error(`Phrases data for slug ${params.slug} is not an array.`);
    notFound();
  }

  // Create a map of translations for efficient lookup by ID
  const translationsMap = new Map(
    phraseItemsTarget.map((item) => [item.id, item.base])
  );

  // Map main phrases to their translations using the ID
  const phrasesToDisplay = phraseItemsMain.map((item) => ({
    key: item.key,
    phrase: item.base,
    translation: translationsMap.get(item.id) || item.base, // Fallback to main phrase if translation not found
  }));

  return (
    <main className="min-h-screen font-sans">
      <div className="w-full max-w-[400px] mx-auto flex flex-col">
        <header className="p-4 flex items-center gap-x-4 sticky top-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
          <Link
            href={{
              pathname: '/',
              query: searchParams.translateTo ? { translateTo: searchParams.translateTo } : undefined,
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
              categorySlug={params.slug}
              phraseKey={p.key}
            />
          ))}
        </section>
      </div>
    </main>
  );
}