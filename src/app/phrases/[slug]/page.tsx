import { PhraseCard } from "@/components/PhraseCard";
import { allPhrases } from "@/lib/phrases";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = Object.keys(allPhrases);
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// The component must be async to use the `params` prop in the App Router.
export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = allPhrases[params.slug];

  // If the slug doesn't match any category, show a 404 page
  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen font-sans">
      <div className="w-full max-w-[400px] mx-auto flex flex-col">
        <header className="p-4 flex items-center gap-x-4 sticky top-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
          <Link
            href="/"
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
          >
            <IoChevronBack className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">{category.title}</h1>
        </header>

        <section className="p-4 flex flex-col gap-y-3">
          {category.phrases.map((p) => (
            <PhraseCard key={p.id} phrase={p.phrase} translation={p.translation} />
          ))}
        </section>
      </div>
    </main>
  );
}